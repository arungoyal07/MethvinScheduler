package methvin.scheduler.bo.containers;

import methvin.scheduler.bo.AssignmentBO;
import methvin.scheduler.bo.CalendarBO;
import methvin.scheduler.bo.DependencyBO;
import methvin.scheduler.bo.ResourceBO;
import methvin.scheduler.bo.TaskBO;

/**
 * Summary DTO for whole received JSON data and produced response
 * 
 * 
 *
 */

public class RequestSummaryBO {
	private String type;
	private Boolean success;
	private Long requestId;
	private Integer revision;
	private SegmentSummaryBO<TaskBO> tasks = new SegmentSummaryBO<TaskBO>();
	private SegmentSummaryBO<DependencyBO> dependencies = new SegmentSummaryBO<DependencyBO>();
	private SegmentSummaryBO<CalendarBO> calendars = new SegmentSummaryBO<CalendarBO>();
	private SegmentSummaryBO<ResourceBO> resources = new SegmentSummaryBO<ResourceBO>();
	private SegmentSummaryBO<AssignmentBO> assignments = new SegmentSummaryBO<AssignmentBO>();

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public Boolean getSuccess() {
		return success;
	}

	public void setSuccess(Boolean success) {
		this.success = success;
	}

	public Long getRequestId() {
		return requestId;
	}

	public void setRequestId(Long requestId) {
		this.requestId = requestId;
	}

	public Integer getRevision() {
		return revision;
	}

	public void setRevision(Integer revision) {
		this.revision = revision;
	}

	public SegmentSummaryBO<TaskBO> getTasks() {
		return tasks;
	}

	public void setTasks(SegmentSummaryBO<TaskBO> tasks) {
		this.tasks = tasks;
	}

	public SegmentSummaryBO<DependencyBO> getDependencies() {
		return dependencies;
	}

	public void setDependencies(SegmentSummaryBO<DependencyBO> dependencies) {
		this.dependencies = dependencies;
	}

	public SegmentSummaryBO<CalendarBO> getCalendars() {
		return calendars;
	}

	public void setCalendars(SegmentSummaryBO<CalendarBO> calendars) {
		this.calendars = calendars;
	}

	public SegmentSummaryBO<ResourceBO> getResources() {
		return resources;
	}

	public void setResources(SegmentSummaryBO<ResourceBO> resources) {
		this.resources = resources;
	}

	public SegmentSummaryBO<AssignmentBO> getAssignments() {
		return assignments;
	}

	public void setAssignments(SegmentSummaryBO<AssignmentBO> assignments) {
		this.assignments = assignments;
	}

}
