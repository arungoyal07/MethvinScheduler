package methvin.scheduler.dao;

import methvin.scheduler.entities.TaskSegmentEntity;

import org.springframework.stereotype.Repository;

/**
 * DAO for task segments
 *
 */
@Repository(value = "taskSegmentDao")
public class TaskSegmentDao extends BaseDao<TaskSegmentEntity> {

}
