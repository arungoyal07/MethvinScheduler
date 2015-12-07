package methvin.scheduler.dao;

import java.util.ArrayList;
import java.util.List;

import methvin.scheduler.bo.ResourceBO;
import methvin.scheduler.entities.ResourceEntity;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

/**
 * DAO for repositories
 * 
 * @author dkomarch
 *
 */
@Repository(value = "resourceDao")
public class ResourceDao extends BaseDao<ResourceEntity> {

	public List<ResourceBO> getAllBO(Integer projectId) {
		List<ResourceEntity> result = getAll(projectId);
		List<ResourceBO> resultList = new ArrayList<ResourceBO>();

		for (ResourceEntity entity : result) {
			resultList.add(new ResourceBO(entity));
		}

		return resultList;
	}
	
	public List<ResourceBO> getResourceWithId(List<Integer> resourceIds) {
		List<ResourceEntity> result = findByCriteria(Restrictions.in("id", resourceIds));
		List<ResourceBO> resultList = new ArrayList<ResourceBO>();

		for (ResourceEntity entity : result) {
			resultList.add(new ResourceBO(entity));
		}
		return resultList;
	}

}
