package methvin.scheduler.entities;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

/**
 * Entity for calendar days
 * 
 * 
 *
 */

@Entity
@Table(name = "planning_calendarDay")
public class CalendarDayEntity extends BaseEntity {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;
	private String name;
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "calId", nullable = false)
	private CalendarEntity calendar;
	private String type;
	@Column(name = "dt")
	private Date date;
	private String availability;
	private Integer weekday;
	private Date overrideStartDate;
	private Date overrideEndDate;
	private Boolean isWorkingDay;
	private String cls;

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public CalendarEntity getCalendar() {
		return calendar;
	}

	public void setCalendar(CalendarEntity calendar) {
		this.calendar = calendar;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public Date getDate() {
		return date;
	}

	public void setDate(Date date) {
		this.date = date;
	}

	public String getAvailability() {
		return availability;
	}

	public void setAvailability(String availability) {
		this.availability = availability;
	}

	public Integer getWeekday() {
		return weekday;
	}

	public void setWeekday(Integer weekday) {
		this.weekday = weekday;
	}

	public Date getOverrideStartDate() {
		return overrideStartDate;
	}

	public void setOverrideStartDate(Date overrideStartDate) {
		this.overrideStartDate = overrideStartDate;
	}

	public Date getOverrideEndDate() {
		return overrideEndDate;
	}

	public void setOverrideEndDate(Date overrideEndDate) {
		this.overrideEndDate = overrideEndDate;
	}

	public Boolean getIsWorkingDay() {
		return isWorkingDay;
	}

	public void setIsWorkingDay(Boolean isWorkingDay) {
		this.isWorkingDay = isWorkingDay;
	}

	public String getCls() {
		return cls;
	}

	public void setCls(String cls) {
		this.cls = cls;
	}

}
