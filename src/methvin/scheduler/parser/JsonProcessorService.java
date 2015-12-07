package methvin.scheduler.parser;

import java.beans.IntrospectionException;
import java.io.IOException;
import java.lang.reflect.InvocationTargetException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import methvin.scheduler.bo.AssignmentBO;
import methvin.scheduler.bo.CalendarBO;
import methvin.scheduler.bo.CalendarDayBO;
import methvin.scheduler.bo.DependencyBO;
import methvin.scheduler.bo.ResourceBO;
import methvin.scheduler.bo.TaskBO;
import methvin.scheduler.bo.TaskSegmentBO;
import methvin.scheduler.bo.containers.RequestSummaryBO;
import methvin.scheduler.bo.containers.ResponseSummaryBO;
import methvin.scheduler.bo.containers.SegmentSummaryBO;
import methvin.scheduler.dao.AssignmentDao;
import methvin.scheduler.dao.CalendarDao;
import methvin.scheduler.dao.CalendarDayDao;
import methvin.scheduler.dao.DependencyDao;
import methvin.scheduler.dao.ProjectDao;
import methvin.scheduler.dao.ResourceDao;
import methvin.scheduler.dao.TaskDao;
import methvin.scheduler.dao.TaskSegmentDao;
import methvin.scheduler.entities.AssignmentEntity;
import methvin.scheduler.entities.CalendarDayEntity;
import methvin.scheduler.entities.CalendarEntity;
import methvin.scheduler.entities.DependencyEntity;
import methvin.scheduler.entities.ProjectEntity;
import methvin.scheduler.entities.ResourceEntity;
import methvin.scheduler.entities.TaskEntity;
import methvin.scheduler.entities.TaskSegmentEntity;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.JsonMappingException;

/**
 * JSON parser service. Provides methods to CRUD data for the given JSON.
 * 
 * @author dkomarch
 *
 */
@Service
@Transactional(propagation = Propagation.REQUIRES_NEW, rollbackFor = Exception.class)
public class JsonProcessorService {
	@Autowired
	private ProjectDao projectDao;
	@Autowired
	private TaskDao taskDao;
	@Autowired
	private TaskSegmentDao taskSegmentDao;
	@Autowired
	private DependencyDao dependencyDao;
	@Autowired
	private CalendarDao calendarDao;
	@Autowired
	private CalendarDayDao calendarDayDao;
	@Autowired
	private AssignmentDao assignmentDao;
	@Autowired
	private ResourceDao resourceDao;

	// Map of PhantomId and real Entities to handle relationships between newly
	// added objects.
	private Map<String, TaskEntity> transientTasks = new HashMap<String, TaskEntity>();
	private Map<String, ResourceEntity> transientResources = new HashMap<String, ResourceEntity>();

	private ProjectEntity project;
	private CalendarEntity calendar;

	public JsonProcessorService() {

	}

	/**
	 * CRUD given JSon data.
	 * 
	 * @param jsonData
	 * @return map of PhantomID and real IDs of new entries.
	 * @throws JsonParseException
	 * @throws JsonMappingException
	 * @throws IOException
	 * @throws SecurityException
	 * @throws NoSuchFieldException
	 * @throws IllegalAccessException
	 * @throws IllegalArgumentException
	 * @throws IntrospectionException
	 * @throws InvocationTargetException
	 */
	public void process(RequestSummaryBO summary, Integer projectId) throws JsonParseException, JsonMappingException, IOException, IllegalArgumentException, IllegalAccessException,
			NoSuchFieldException, SecurityException, InvocationTargetException, IntrospectionException {
		getProjectData(projectId);

		SegmentSummaryBO<TaskBO> taskSummaryDTO = summary.getTasks();
		if (taskSummaryDTO != null) {
			processTasks(taskSummaryDTO);
		}

		SegmentSummaryBO<DependencyBO> dependencySummaryDTO = summary.getDependencies();
		if (dependencySummaryDTO != null) {
			processDependencies(dependencySummaryDTO);
		}

		SegmentSummaryBO<CalendarBO> calendarSummaryDTO = summary.getCalendars();
		if (calendarSummaryDTO != null) {
			processCalendars(calendarSummaryDTO);
		}

		SegmentSummaryBO<ResourceBO> resourceSummaryDTO = summary.getResources();
		if (resourceSummaryDTO != null) {
			processResources(resourceSummaryDTO);
		}

		SegmentSummaryBO<AssignmentBO> assignemntSummaryDTO = summary.getAssignments();
		if (assignemntSummaryDTO != null) {
			processAssignments(assignemntSummaryDTO);
		}
	}

	/**
	 * CRUD assignments and update provided DTO
	 * 
	 * @param assignmentSummaryDTO
	 * @throws IllegalArgumentException
	 * @throws IllegalAccessException
	 * @throws NoSuchFieldException
	 * @throws SecurityException
	 * @throws InvocationTargetException
	 * @throws IntrospectionException
	 */
	private void processAssignments(SegmentSummaryBO<AssignmentBO> assignmentSummaryDTO) throws IllegalArgumentException, IllegalAccessException, NoSuchFieldException, SecurityException,
			InvocationTargetException, IntrospectionException {
		if (assignmentSummaryDTO.getAdded() != null) {
			for (AssignmentBO toInsert : assignmentSummaryDTO.getAdded()) {
				AssignmentEntity entity = new AssignmentEntity();

				toInsert.mapToEntity(entity);
				entity.setTask(getTaskEntity(toInsert.getTaskId()));
				entity.setResource(getResourceEntity(toInsert.getResourceId()));

				assignmentDao.save(entity);

				toInsert.setId(entity.getId());
			}
		}

		if (assignmentSummaryDTO.getUpdated() != null) {
			for (AssignmentBO toUpdate : assignmentSummaryDTO.getUpdated()) {
				Integer assignmentId = toUpdate.getId();
				AssignmentEntity entity = assignmentDao.getById(assignmentId);
				toUpdate.mapToEntity(entity);

				assignmentDao.save(entity);
			}
		}

		if (assignmentSummaryDTO.getRemoved() != null) {
			for (AssignmentBO toRemove : assignmentSummaryDTO.getRemoved()) {
				Integer assignmentId = toRemove.getId();
				AssignmentEntity entity = assignmentDao.getById(assignmentId);

				// if entity was not deleted by cascade
				if (entity != null) {
					assignmentDao.delete(entity);
				}
			}
		}
	}

	/**
	 * CRUD resources and udpate provided DTO
	 * 
	 * @param resourceSummaryDTO
	 * @throws IllegalArgumentException
	 * @throws IllegalAccessException
	 * @throws NoSuchFieldException
	 * @throws SecurityException
	 * @throws InvocationTargetException
	 * @throws IntrospectionException
	 */
	private void processResources(SegmentSummaryBO<ResourceBO> resourceSummaryDTO) throws IllegalArgumentException, IllegalAccessException, NoSuchFieldException, SecurityException,
			InvocationTargetException, IntrospectionException {
		if (resourceSummaryDTO.getAdded() != null) {
			for (ResourceBO toInsert : resourceSummaryDTO.getAdded()) {
				ResourceEntity entity = new ResourceEntity();

				toInsert.mapToEntity(entity);
				entity.setProject(project);
				entity.setCalendar(calendar);

				resourceDao.save(entity);

				transientResources.put(toInsert.getPhantomId(), entity);
				toInsert.setId(entity.getId());
			}
		}

		if (resourceSummaryDTO.getUpdated() != null) {
			for (ResourceBO toUpdate : resourceSummaryDTO.getUpdated()) {
				Integer resourceId = toUpdate.getId();
				ResourceEntity entity = resourceDao.getById(resourceId);
				toUpdate.mapToEntity(entity);

				if (toUpdate.getCalendarId() != null) {
					entity.setCalendar(calendarDao.getById(toUpdate.getCalendarId()));
				}

				resourceDao.save(entity);
			}
		}

		if (resourceSummaryDTO.getRemoved() != null) {
			for (ResourceBO toRemove : resourceSummaryDTO.getRemoved()) {
				Integer resourceId = toRemove.getId();
				ResourceEntity entity = resourceDao.getById(resourceId);
				resourceDao.delete(entity);
			}
		}
	}

	/**
	 * CRUD calendars and update data in provided DTO
	 * 
	 * @param calendarSummaryDTO
	 * @throws IllegalArgumentException
	 * @throws IllegalAccessException
	 * @throws NoSuchFieldException
	 * @throws SecurityException
	 * @throws InvocationTargetException
	 * @throws IntrospectionException
	 */
	private void processCalendars(SegmentSummaryBO<CalendarBO> calendarSummaryDTO) throws IllegalArgumentException, IllegalAccessException, NoSuchFieldException, SecurityException,
			InvocationTargetException, IntrospectionException {
		if (calendarSummaryDTO.getAdded() != null) {
			for (CalendarBO toInsert : calendarSummaryDTO.getAdded()) {
				CalendarEntity entity = new CalendarEntity();

				toInsert.mapToEntity(entity);
				entity.setProject(project);
				entity.setDefaultAvailability(Arrays.toString(toInsert.getDefaultAvailability().toArray()));

				if (toInsert.getParentId() != null && !toInsert.getParentId().equals("root")) {
					CalendarEntity parent = calendarDao.getById(Integer.valueOf(toInsert.getParentId()));
					entity.setParent(parent);
				}

				if (toInsert.getDays() != null) {
					processCalendarDays(toInsert.getDays(), entity);
				}

				calendarDao.save(entity);

				toInsert.setId(entity.getId());
			}
		}

		if (calendarSummaryDTO.getUpdated() != null) {
			for (CalendarBO toUpdate : calendarSummaryDTO.getUpdated()) {
				Integer calendarId = toUpdate.getId();
				CalendarEntity entity = calendarDao.getById(calendarId);
				toUpdate.mapToEntity(entity);

				if (toUpdate.getParentId() != null && !toUpdate.getParentId().equals("root")) {
					CalendarEntity parent = calendarDao.getById(Integer.valueOf(toUpdate.getParentId()));
					entity.setParent(parent);
				}

				if (toUpdate.getDays() != null) {
					processCalendarDays(toUpdate.getDays(), entity);
				}

				calendarDao.save(entity);
			}
		}

		if (calendarSummaryDTO.getRemoved() != null) {
			for (CalendarBO toRemove : calendarSummaryDTO.getRemoved()) {
				Integer calendarId = toRemove.getId();
				CalendarEntity entity = calendarDao.getById(calendarId);
				calendarDao.delete(entity);
			}
		}
	}

	/**
	 * CRUD Calendar days
	 * 
	 * @param calendarDaysSummaryDTO
	 * @param calendarEntity
	 * @throws IllegalArgumentException
	 * @throws IllegalAccessException
	 * @throws NoSuchFieldException
	 * @throws SecurityException
	 * @throws InvocationTargetException
	 * @throws IntrospectionException
	 */
	private void processCalendarDays(SegmentSummaryBO<CalendarDayBO> calendarDaysSummaryDTO, CalendarEntity calendarEntity) throws IllegalArgumentException, IllegalAccessException,
			NoSuchFieldException, SecurityException, InvocationTargetException, IntrospectionException {
		if (calendarDaysSummaryDTO.getAdded() != null) {
			for (CalendarDayBO toInsert : calendarDaysSummaryDTO.getAdded()) {
				CalendarDayEntity entity = new CalendarDayEntity();

				toInsert.mapToEntity(entity);
				entity.setCalendar(calendarEntity);

				if (toInsert.getAvailability() != null && toInsert.getAvailability().size() > 0) {
					entity.setAvailability(toInsert.getAvailability().toString());
				}

				calendarDayDao.save(entity);
				toInsert.setId(entity.getId());
			}
		}

		if (calendarDaysSummaryDTO.getUpdated() != null) {
			for (CalendarDayBO toUpdate : calendarDaysSummaryDTO.getUpdated()) {
				Integer calendarDayId = toUpdate.getId();
				CalendarDayEntity entity = calendarDayDao.getById(calendarDayId);

				toUpdate.mapToEntity(entity);

				if (toUpdate.getAvailability() != null && toUpdate.getAvailability().size() > 0) {
					entity.setAvailability(toUpdate.getAvailability().toString());
				}

				calendarDayDao.save(entity);
			}
		}

		if (calendarDaysSummaryDTO.getRemoved() != null) {
			for (CalendarDayBO toRemove : calendarDaysSummaryDTO.getRemoved()) {
				Integer calendarDayId = toRemove.getId();
				CalendarDayEntity entity = calendarDayDao.getById(calendarDayId);
				calendarDayDao.delete(entity);
			}
		}
	}

	/**
	 * CRUD Dependencies and update data in provided DTO
	 * 
	 * @param dependencySummaryDTO
	 * @throws IllegalArgumentException
	 * @throws IllegalAccessException
	 * @throws NoSuchFieldException
	 * @throws SecurityException
	 * @throws InvocationTargetException
	 * @throws IntrospectionException
	 */
	private void processDependencies(SegmentSummaryBO<DependencyBO> dependencySummaryDTO) throws IllegalArgumentException, IllegalAccessException, NoSuchFieldException, SecurityException,
			InvocationTargetException, IntrospectionException {
		if (dependencySummaryDTO.getAdded() != null) {
			for (DependencyBO toInsert : dependencySummaryDTO.getAdded()) {
				DependencyEntity entity = new DependencyEntity();

				toInsert.mapToEntity(entity);
				entity.setFrom(getTaskEntity(toInsert.getFrom()));
				entity.setTo(getTaskEntity(toInsert.getTo()));
				entity.setProject(project);

				dependencyDao.save(entity);

				toInsert.setId(entity.getId());
			}
		}

		if (dependencySummaryDTO.getUpdated() != null) {
			for (DependencyBO toUpdate : dependencySummaryDTO.getUpdated()) {
				Integer dependencyId = toUpdate.getId();
				DependencyEntity entity = dependencyDao.getById(dependencyId);
				toUpdate.mapToEntity(entity);

				dependencyDao.save(entity);
			}
		}

		if (dependencySummaryDTO.getRemoved() != null) {
			for (DependencyBO toRemove : dependencySummaryDTO.getRemoved()) {
				Integer dependencyId = toRemove.getId();
				DependencyEntity entity = dependencyDao.getById(dependencyId);
				// if entity was not deleted by cascade
				if (entity != null) {
					dependencyDao.delete(entity);
				}
			}
		}
	}

	/**
	 * CRUD Tasks and update data in provided DTO
	 * 
	 * @param taskSummaryDTO
	 * @throws IllegalArgumentException
	 * @throws IllegalAccessException
	 * @throws NoSuchFieldException
	 * @throws SecurityException
	 * @throws InvocationTargetException
	 * @throws IntrospectionException
	 */
	private void processTasks(SegmentSummaryBO<TaskBO> taskSummaryDTO) throws IllegalArgumentException, IllegalAccessException, NoSuchFieldException, SecurityException, InvocationTargetException,
			IntrospectionException {
		if (taskSummaryDTO.getAdded() != null) {
			for (TaskBO toInsert : taskSummaryDTO.getAdded()) {
				TaskEntity entity = new TaskEntity();
				entity.setProject(project);

				toInsert.mapToEntity(entity);

				taskDao.save(entity);

				transientTasks.put(toInsert.getPhantomId(), entity);

				toInsert.setId(entity.getId());
			}

			// handle parents including phantoms
			for (TaskBO toInsert : taskSummaryDTO.getAdded()) {
				if (toInsert.getParentId() != null && !toInsert.getParentId().equals("root")) {
					TaskEntity entity = taskDao.getById(toInsert.getId());
					TaskEntity parentEntity = null;

					parentEntity = getTaskEntity(toInsert.getParentId());

					entity.setParent(parentEntity);
					parentEntity.getChildren().add(entity);
					taskDao.save(entity);
					taskDao.save(parentEntity);
				}
			}
		}

		if (taskSummaryDTO.getUpdated() != null) {
			for (TaskBO toUpdate : taskSummaryDTO.getUpdated()) {
				TaskEntity entity = taskDao.getById(toUpdate.getId());

				if (toUpdate.getParentId() != null && toUpdate.getParentId().equals("root")) {
					entity.setParent(null);
				} else if ((entity.getParent() != null && !entity.getParent().getId().equals(toUpdate.getParentId())) || (entity.getParent() == null && toUpdate.getParentId() != null)) {
					if (transientTasks.containsKey(toUpdate.getParentId())) {
						entity.setParent(transientTasks.get(toUpdate.getParentId()));
					} else if (toUpdate.getParentId() != null) {
						Integer parentId = Integer.parseInt(toUpdate.getParentId());
						TaskEntity parent = taskDao.getById(parentId);
						entity.setParent(parent);
					}
				}

				toUpdate.mapToEntity(entity);

				if (toUpdate.getSegments() != null) {
					for (TaskSegmentBO segment : toUpdate.getSegments()) {
						TaskSegmentEntity segmentEntity;
						if (segment.getId() == null) {
							segmentEntity = new TaskSegmentEntity();
						} else {
							segmentEntity = taskSegmentDao.getById(segment.getId());
						}

						segment.mapToEntity(segmentEntity);
						entity.getSegments().add(segmentEntity);
					}
				}

				taskDao.save(entity);
			}
		}

		if (taskSummaryDTO.getRemoved() != null) {
			for (TaskBO toRemove : taskSummaryDTO.getRemoved()) {
				TaskEntity entity = taskDao.getById(toRemove.getId());
				taskDao.delete(entity);
			}
		}
	}

	/**
	 * Read initial data
	 * 
	 * @return
	 */
	public ResponseSummaryBO getData(Integer projectId) {
		getProjectData(projectId);

		ResponseSummaryBO response = new ResponseSummaryBO();
		response.getTasks().setData(taskDao.getAllRootBO(projectId));
		response.getDependencies().setData(dependencyDao.getAllBO(projectId));
		response.getCalendars().setData(calendarDao.getAllRootBO(projectId));
		response.getResources().setData(resourceDao.getAllBO(projectId));

		Set<Integer> taskIds = new HashSet<Integer>();
		for (TaskBO taskBO : response.getTasks().getData()) {
			taskIds.add(taskBO.getId());
			taskIds.addAll(getChildTaskIds(taskBO));
		}

		if (taskIds.size() > 0) {
			response.getAssignments().setData(assignmentDao.getAllBO(taskIds));
		}

		response.setSuccess(true);
		return response;
	}

	/**
	 * Prepare given summary to be included into REST response
	 * 
	 * @param summary
	 */
	public void prepareForResponse(RequestSummaryBO summary) {
		if (summary.getRevision() != null) {
			summary.setRevision(summary.getRevision() + 1);
		}

		prepareTasksForResponse(summary);
		prepareResourcesForResponse(summary);
		prepareDependenciesForResponse(summary);
		prepareCalendarsForResponse(summary);
		prepareAssignmentsForResponse(summary);
	}

	/**
	 * Shake Assignments data in summary and replace it with latest
	 * 
	 * @param summary
	 */
	private void prepareAssignmentsForResponse(RequestSummaryBO summary) {
		List<Integer> assignmentIds = new ArrayList<Integer>();
		// get latest version of updated assignments from db
		for (AssignmentBO assignment : summary.getAssignments().getUpdated()) {
			assignmentIds.add(assignment.getId());
		}
		if (assignmentIds.size() > 0) {
			summary.getAssignments().getRows().addAll(assignmentDao.getAssignmentsWithId(assignmentIds));
		}

		assignmentIds.clear();

		// get latest version of added assignments from db
		for (AssignmentBO assignment : summary.getAssignments().getAdded()) {
			assignmentIds.add(assignment.getId());
		}
		if (assignmentIds.size() > 0) {
			summary.getAssignments().getRows().addAll(assignmentDao.getAssignmentsWithId(assignmentIds));
		}

		for (AssignmentBO assignment : summary.getAssignments().getAdded()) {
			for (AssignmentBO updatedAssignment : summary.getAssignments().getRows()) {
				if (assignment.getPhantomId() != null && updatedAssignment.getId().intValue() == assignment.getId().intValue()) {
					updatedAssignment.setPhantomId(assignment.getPhantomId());
				}
			}
		}
		summary.getAssignments().setAdded(null);
		summary.getAssignments().setUpdated(null);
	}

	/**
	 * Shake Calendars data in summary and replace it with latest
	 * 
	 * @param summary
	 */
	private void prepareCalendarsForResponse(RequestSummaryBO summary) {
		List<Integer> calendarIds = new ArrayList<Integer>();
		Map<Integer, String> addedCalendarDaysPhantomIds = new HashMap<Integer, String>();

		// get latest version of updated tasks from db
		for (CalendarBO calendar : summary.getCalendars().getUpdated()) {
			calendarIds.add(calendar.getId());

			if (calendar.getDays() != null) {
				for (CalendarDayBO calendarDay : calendar.getDays().getAdded()) {
					addedCalendarDaysPhantomIds.put(calendarDay.getId(), calendarDay.getPhantomId());
				}
			}
		}

		for (CalendarBO calendar : summary.getCalendars().getAdded()) {
			calendarIds.add(calendar.getId());

			if (calendar.getDays() != null) {
				for (CalendarDayBO calendarDay : calendar.getDays().getAdded()) {
					addedCalendarDaysPhantomIds.put(calendarDay.getId(), calendarDay.getPhantomId());
				}
			}
		}

		// get latest version of calendars from db
		if (calendarIds.size() > 0) {
			summary.getCalendars().getRows().addAll(calendarDao.getCalendarsWithId(calendarIds));
		}

		for (CalendarBO calendar : summary.getCalendars().getAdded()) {
			for (CalendarBO addedCalendar : summary.getCalendars().getRows()) {
				if (calendar.getPhantomId() != null && addedCalendar.getId().equals(calendar.getId())) {
					addedCalendar.setPhantomId(calendar.getPhantomId());
				}
			}
		}

		List<CalendarBO> allCalendars = new ArrayList<CalendarBO>(summary.getCalendars().getAdded());
		allCalendars.addAll(summary.getCalendars().getUpdated());

		for (CalendarBO calendar : allCalendars) {
			for (CalendarBO modifiedCalendar : summary.getCalendars().getRows()) {
				if (calendar.getId().intValue() == modifiedCalendar.getId().intValue()) {
					if (calendar.getDays() != null) {
						modifiedCalendar.getDays().setRows(new ArrayList<CalendarDayBO>());

						// only added calendar days may contain phantomIds
						for (CalendarDayBO calendarDay : calendar.getDays().getAdded()) {
							CalendarDayBO savedCalendarDay = new CalendarDayBO(calendarDayDao.getById(calendarDay.getId()));
							savedCalendarDay.setPhantomId(addedCalendarDaysPhantomIds.get(calendarDay.getId()));
							modifiedCalendar.getDays().getRows().add(savedCalendarDay);
						}

						for (CalendarDayBO calendarDay : calendar.getDays().getUpdated()) {
							CalendarDayBO savedCalendarDay = new CalendarDayBO(calendarDayDao.getById(calendarDay.getId()));
							modifiedCalendar.getDays().getRows().add(savedCalendarDay);
						}

						modifiedCalendar.getDays().setRemoved(calendar.getDays().getRemoved());

						modifiedCalendar.getDays().setAdded(null);
						modifiedCalendar.getDays().setUpdated(null);
					}
				}
			}
		}

		summary.getCalendars().setAdded(null);
		summary.getCalendars().setUpdated(null);
	}

	/**
	 * Shake Dependencies data in summary and replace it with latest
	 * 
	 * @param summary
	 */
	private void prepareDependenciesForResponse(RequestSummaryBO summary) {
		List<Integer> dependenciesIds = new ArrayList<Integer>();
		// get latest version of updated dependencies from db
		for (DependencyBO dependency : summary.getDependencies().getUpdated()) {
			dependenciesIds.add(dependency.getId());
		}
		if (dependenciesIds.size() > 0) {
			summary.getDependencies().getRows().addAll(dependencyDao.getDependenciesWithId(dependenciesIds));
		}

		dependenciesIds.clear();

		// get latest version of added dependencies from db
		for (DependencyBO dependency : summary.getDependencies().getAdded()) {
			dependenciesIds.add(dependency.getId());
		}
		if (dependenciesIds.size() > 0) {
			summary.getDependencies().getRows().addAll(dependencyDao.getDependenciesWithId(dependenciesIds));
		}

		for (DependencyBO dependency : summary.getDependencies().getAdded()) {
			for (DependencyBO updatedDependency : summary.getDependencies().getRows()) {
				if (dependency.getPhantomId() != null && updatedDependency.getId().intValue() == dependency.getId().intValue()) {
					updatedDependency.setPhantomId(dependency.getPhantomId());
				}
			}
		}
		summary.getDependencies().setAdded(null);
		summary.getDependencies().setUpdated(null);
	}

	/**
	 * Shake Resources data in summary and replace it with latest
	 * 
	 * @param summary
	 */
	private void prepareResourcesForResponse(RequestSummaryBO summary) {
		List<Integer> resourceIds = new ArrayList<Integer>();
		// get latest version of updated resource from db
		for (ResourceBO resource : summary.getResources().getUpdated()) {
			resourceIds.add(resource.getId());
		}
		if (resourceIds.size() > 0) {
			summary.getResources().getRows().addAll(resourceDao.getResourceWithId(resourceIds));
		}

		resourceIds.clear();

		// get latest version of added resource from db
		for (ResourceBO resource : summary.getResources().getAdded()) {
			resourceIds.add(resource.getId());
		}
		if (resourceIds.size() > 0) {
			summary.getResources().getRows().addAll(resourceDao.getResourceWithId(resourceIds));
		}

		for (ResourceBO resource : summary.getResources().getAdded()) {
			for (ResourceBO updatedResources : summary.getResources().getRows()) {
				if (resource.getPhantomId() != null && updatedResources.getId().intValue() == resource.getId().intValue()) {
					updatedResources.setPhantomId(resource.getPhantomId());
				}
			}
		}
		summary.getResources().setAdded(null);
		summary.getResources().setUpdated(null);
	}

	/**
	 * Shake Tasks data in summary and replace it with latest
	 * 
	 * @param summary
	 */
	private void prepareTasksForResponse(RequestSummaryBO summary) {
		List<Integer> taskIds = new ArrayList<Integer>();

		// get latest version of updated tasks from db
		for (TaskBO task : summary.getTasks().getUpdated()) {
			taskIds.add(task.getId());
		}
		if (taskIds.size() > 0) {
			summary.getTasks().getRows().addAll(taskDao.getTasksWithId(taskIds));
		}

		taskIds.clear();

		// get latest version of added tasks from db
		for (TaskBO task : summary.getTasks().getAdded()) {
			taskIds.add(task.getId());
		}
		if (taskIds.size() > 0) {
			summary.getTasks().getRows().addAll(taskDao.getTasksWithId(taskIds));
		}

		for (TaskBO task : summary.getTasks().getAdded()) {
			for (TaskBO updatedTask : summary.getTasks().getRows()) {
				if (task.getPhantomId() != null && updatedTask.getId().intValue() == task.getId().intValue()) {
					updatedTask.setPhantomId(task.getPhantomId());
				}
			}
		}

		summary.getTasks().setAdded(null);
		summary.getTasks().setUpdated(null);
	}

	/**
	 * Find TaskEntity in transient entities or in DB
	 * 
	 * @param taskId
	 * @return
	 */
	private TaskEntity getTaskEntity(String taskId) {
		if (transientTasks.containsKey(taskId)) {
			return transientTasks.get(taskId);
		} else {
			Integer taskIdInt = Integer.parseInt(taskId);
			return taskDao.getById(taskIdInt);
		}
	}

	/**
	 * Find ResourceEntity in transient entities or in DB
	 * 
	 * @param resourceId
	 * @return
	 */
	private ResourceEntity getResourceEntity(String resourceId) {
		if (transientResources.containsKey(resourceId)) {
			return transientResources.get(resourceId);
		} else {
			Integer resourceIdInt = Integer.parseInt(resourceId);
			return resourceDao.getById(resourceIdInt);
		}
	}

	/**
	 * Get all Task children IDs walking through all subtrees
	 * 
	 * @param task
	 * @return
	 */
	private Set<Integer> getChildTaskIds(TaskBO task) {
		Set<Integer> ids = new HashSet<Integer>();
		if (task.getChildren() != null) {
			for (TaskBO child : task.getChildren()) {
				ids.add(child.getId());
				ids.addAll(getChildTaskIds(child));
			}
		}

		return ids;
	}

	/**
	 * Get project and calendar data using given projectId
	 * 
	 * @param projectId
	 */
	private void getProjectData(Integer projectId) {
		project = projectDao.getById(projectId);
		if (project == null || project.getId() == null) {
			project = new ProjectEntity(projectId);
			projectDao.save(project);

			calendar = createDefaultCalendar(project);
		} else {
			calendar = calendarDao.getByProjectId(projectId);
		}
	}

	/**
	 * Create default calendar for new project
	 * 
	 * @return
	 */
	private CalendarEntity createDefaultCalendar(ProjectEntity project) {
		CalendarEntity calendar = new CalendarEntity();
		calendar.setName("General");
		calendar.setDaysPerWeek(7);
		calendar.setDaysPerMonth(30);
		calendar.setHoursPerDay(8);
		calendar.setWeekendFirstDay(6);
		calendar.setWeekendSecondDay(0);
		calendar.setWeekendsAreWorkdays(false);
		calendar.setDefaultAvailability("[00:00-24:00]");
		calendar.setLeaf(true);

		calendar.setProject(project);

		calendarDao.save(calendar);

		CalendarEntity nightShiftCalendar = new CalendarEntity();
		nightShiftCalendar.setName("Night shift calendar");
		nightShiftCalendar.setDaysPerWeek(7);
		nightShiftCalendar.setDaysPerMonth(30);
		nightShiftCalendar.setHoursPerDay(8);
		nightShiftCalendar.setWeekendFirstDay(6);
		nightShiftCalendar.setWeekendSecondDay(0);
		nightShiftCalendar.setWeekendsAreWorkdays(false);
		nightShiftCalendar.setDefaultAvailability("[19:00-24:00, 02:00-05:00]");
		nightShiftCalendar.setLeaf(true);

		nightShiftCalendar.setProject(project);

		calendarDao.save(nightShiftCalendar);

		return calendar;
	}
}
