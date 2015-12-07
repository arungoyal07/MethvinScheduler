package methvin.scheduler.entities;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;

/**
 * Entity for calendars
 * 
 * 
 *
 */

@Entity
@Table(name = "planning_calendar")
public class CalendarEntity extends BaseEntity {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "parentId", nullable = true)
	private CalendarEntity parent;
	@OneToMany(mappedBy = "parent", fetch = FetchType.LAZY)
	private List<CalendarEntity> children = new ArrayList<CalendarEntity>();
	@Column(nullable = false)
	private Boolean leaf;
	private String name;
	private Integer daysPerMonth;
	private Integer daysPerWeek;
	private Integer hoursPerDay;
	@Column(nullable = false)
	private Boolean weekendsAreWorkdays;
	private Integer weekendFirstDay;
	private Integer weekendSecondDay;
	private String defaultAvailability;
	@OneToMany(cascade = CascadeType.ALL, mappedBy = "calendar", orphanRemoval = true)
	private List<CalendarDayEntity> days = new ArrayList<CalendarDayEntity>();
	private String calendarClass;
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "projectId", nullable = false)
	private ProjectEntity project;

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public CalendarEntity getParent() {
		return parent;
	}

	public void setParent(CalendarEntity parent) {
		this.parent = parent;
	}

	public List<CalendarEntity> getChildren() {
		return children;
	}

	public void setChildren(List<CalendarEntity> children) {
		this.children = children;
	}

	public Boolean getLeaf() {
		return leaf;
	}

	public void setLeaf(Boolean leaf) {
		this.leaf = leaf;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public Integer getDaysPerMonth() {
		return daysPerMonth;
	}

	public void setDaysPerMonth(Integer daysPerMonth) {
		this.daysPerMonth = daysPerMonth;
	}

	public Integer getDaysPerWeek() {
		return daysPerWeek;
	}

	public void setDaysPerWeek(Integer daysPerWeek) {
		this.daysPerWeek = daysPerWeek;
	}

	public Integer getHoursPerDay() {
		return hoursPerDay;
	}

	public void setHoursPerDay(Integer hoursPerDay) {
		this.hoursPerDay = hoursPerDay;
	}

	public Boolean getWeekendsAreWorkdays() {
		return weekendsAreWorkdays;
	}

	public void setWeekendsAreWorkdays(Boolean weekendsAreWorkdays) {
		this.weekendsAreWorkdays = weekendsAreWorkdays;
	}

	public Integer getWeekendFirstDay() {
		return weekendFirstDay;
	}

	public void setWeekendFirstDay(Integer weekendFirstDay) {
		this.weekendFirstDay = weekendFirstDay;
	}

	public Integer getWeekendSecondDay() {
		return weekendSecondDay;
	}

	public void setWeekendSecondDay(Integer weekendSecondDay) {
		this.weekendSecondDay = weekendSecondDay;
	}

	public String getDefaultAvailability() {
		return defaultAvailability;
	}

	public void setDefaultAvailability(String defaultAvailability) {
		this.defaultAvailability = defaultAvailability;
	}

	public List<CalendarDayEntity> getDays() {
		return days;
	}

	public void setDays(List<CalendarDayEntity> days) {
		this.days = days;
	}

	public String getCalendarClass() {
		return calendarClass;
	}

	public void setCalendarClass(String calendarClass) {
		this.calendarClass = calendarClass;
	}

	public ProjectEntity getProject() {
		return project;
	}

	public void setProject(ProjectEntity project) {
		this.project = project;
	}

}
