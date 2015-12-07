package methvin.scheduler.dao;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import methvin.scheduler.bo.CalendarBO;
import methvin.scheduler.entities.CalendarEntity;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

/**
 * DAO for CalendarEntity
 * 
 * @author dkomarch
 *
 */
@Repository(value = "calendarDao")
public class CalendarDao extends BaseDao<CalendarEntity> {

	public List<CalendarBO> getAllBO(Integer projectId) {
		List<CalendarEntity> result = getAll(projectId);
		List<CalendarBO> resultList = new ArrayList<CalendarBO>();

		for (CalendarEntity entity : result) {
			resultList.add(new CalendarBO(entity));
		}

		return resultList;
	}

	public Collection<? extends CalendarBO> getCalendarsWithId(List<Integer> calendarIds) {
		List<CalendarEntity> result = findByCriteria(Restrictions.in("id", calendarIds));
		List<CalendarBO> resultList = new ArrayList<CalendarBO>();

		for (CalendarEntity entity : result) {
			resultList.add(new CalendarBO(entity));
		}

		return resultList;
	}

	public CalendarEntity getByProjectId(Integer projectId) {
		List<CalendarEntity> result = findByCriteria(Restrictions.eq("project.id", projectId));
		return result.get(0);
	}

	public List<CalendarEntity> getAllRoot(Integer projectId) {
		return findByCriteria(Restrictions.isNull("parent"), Restrictions.eq("project.id", projectId));
	}

	public List<CalendarBO> getAllRootBO(Integer projectId) {
		List<CalendarEntity> result = getAllRoot(projectId);
		List<CalendarBO> resultList = new ArrayList<CalendarBO>();

		for (CalendarEntity entity : result) {
			resultList.add(new CalendarBO(entity));
		}

		return resultList;
	}

}
