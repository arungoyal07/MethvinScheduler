package methvin.scheduler.dao;

import java.util.ArrayList;
import java.util.List;

import methvin.scheduler.bo.DependencyBO;
import methvin.scheduler.entities.DependencyEntity;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

/**
 * DAO for dependency entities
 * 
 */

@Repository(value = "dependencyDao")
public class DependencyDao extends BaseDao<DependencyEntity> {

	public List<DependencyBO> getAllBO(Integer projectId) {
		List<DependencyEntity> result = getAll(projectId);
		List<DependencyBO> resultList = new ArrayList<DependencyBO>();

		for (DependencyEntity entity : result) {
			resultList.add(new DependencyBO(entity));
		}

		return resultList;
	}

	public List<DependencyBO> getDependenciesWithId(List<Integer> dependenciesIds) {
		List<DependencyEntity> result = findByCriteria(Restrictions.in("id", dependenciesIds));
		List<DependencyBO> resultList = new ArrayList<DependencyBO>();

		for (DependencyEntity entity : result) {
			resultList.add(new DependencyBO(entity));
		}

		return resultList;
	}

}
