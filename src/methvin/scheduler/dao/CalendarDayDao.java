package methvin.scheduler.dao;

import methvin.scheduler.entities.CalendarDayEntity;

import org.springframework.stereotype.Repository;

/**
 * DAO for CalendarDay
 * 
 * @author dkomarch
 *
 */
@Repository(value = "calendarDayDao")
public class CalendarDayDao extends BaseDao<CalendarDayEntity> {

}
