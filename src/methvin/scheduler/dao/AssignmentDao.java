package methvin.scheduler.dao;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import methvin.scheduler.bo.AssignmentBO;
import methvin.scheduler.entities.AssignmentEntity;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

/**
 * DAO for assignments
 * 
 * @author dkomarch
 *
 */
@Repository(value = "assignmentDao")
public class AssignmentDao extends BaseDao<AssignmentEntity> {

	public List<AssignmentBO> getAllBO(Set<Integer> taskIds) {
		List<AssignmentEntity> result = findByCriteria(Restrictions.in("task.id", taskIds));
		List<AssignmentBO> resultList = new ArrayList<AssignmentBO>();

		for (AssignmentEntity entity : result) {
			resultList.add(new AssignmentBO(entity));
		}

		return resultList;
	}

	public List<AssignmentBO> getAssignmentsWithId(List<Integer> assignmentIds) {
		List<AssignmentEntity> result = findByCriteria(Restrictions.in("id", assignmentIds));
		List<AssignmentBO> resultList = new ArrayList<AssignmentBO>();

		for (AssignmentEntity entity : result) {
			resultList.add(new AssignmentBO(entity));
		}

		return resultList;
	}

}
