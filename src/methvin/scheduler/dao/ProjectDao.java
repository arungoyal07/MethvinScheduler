package methvin.scheduler.dao;

import methvin.scheduler.entities.ProjectEntity;

import org.springframework.stereotype.Repository;

/**
 * DAO for projects
 * 
 * @author dkomarch
 *
 */
@Repository(value = "projectDao")
public class ProjectDao extends BaseDao<ProjectEntity> {

}
