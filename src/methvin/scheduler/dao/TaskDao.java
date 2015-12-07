package methvin.scheduler.dao;

import java.util.ArrayList;
import java.util.List;

import methvin.scheduler.bo.TaskBO;
import methvin.scheduler.entities.TaskEntity;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

/**
 * Simple DAO for Task entities
 * 
 */
@Repository(value = "taskDao")
public class TaskDao extends BaseDao<TaskEntity> {

	public TaskDao() {
	}

	public List<TaskEntity> getAllRoot(Integer projectId) {
		return findByCriteria(Restrictions.isNull("parent"), Restrictions.eq("project.id", projectId));
	}

	public List<TaskBO> getAllRootBO(Integer projectId) {
		List<TaskEntity> result = getAllRoot(projectId);
		List<TaskBO> resultList = new ArrayList<TaskBO>();

		for (TaskEntity entity : result) {
			resultList.add(new TaskBO(entity));
		}

		return resultList;
	}

	public List<TaskBO> getTasksWithId(List<Integer> taskIds) {
		List<TaskEntity> result = findByCriteria(Restrictions.in("id", taskIds));
		List<TaskBO> resultList = new ArrayList<TaskBO>();

		for (TaskEntity entity : result) {
			resultList.add(new TaskBO(entity));
		}
		return resultList;
	}

}
