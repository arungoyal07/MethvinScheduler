package methvin.scheduler.bo;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import methvin.scheduler.bo.containers.SegmentSummaryBO;
import methvin.scheduler.entities.CalendarDayEntity;
import methvin.scheduler.entities.CalendarEntity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonView;

/**
 * Business object for calendars
 * 
 *
 */
public class CalendarBO extends BaseBO {
	@JsonIgnore
	protected String phantomId;
	@JsonIgnore
	protected Integer id;
	@JsonIgnore
	protected String parentId;
	@JsonIgnore
	protected Boolean leaf;
	@JsonIgnore
	protected String name;
	@JsonIgnore
	protected Integer daysPerMonth;
	@JsonIgnore
	protected Integer daysPerWeek;
	@JsonIgnore
	protected Integer hoursPerDay;
	@JsonIgnore
	protected Boolean weekendsAreWorkdays;
	@JsonIgnore
	protected Integer weekendFirstDay;
	@JsonIgnore
	protected Integer weekendSecondDay;
	@JsonIgnore
	protected List<String> defaultAvailability = new ArrayList<String>();
	@JsonProperty(value = "Days")
	protected SegmentSummaryBO<CalendarDayBO> days = new SegmentSummaryBO<CalendarDayBO>();
	@JsonIgnore
	protected String calendarClass;
	@JsonIgnore
	protected String phantomParentId;
	@JsonProperty(value = "children")
	@JsonView(value = BaseBO.ResponseView.class)
	protected List<CalendarBO> children = new ArrayList<CalendarBO>();

	public CalendarBO() {
	}

	public CalendarBO(CalendarEntity entity) {
		super(entity);

		if (entity.getParent() != null) {
			this.parentId = entity.getParent().getId().toString();
		} else {
			this.parentId = "root";
		}

		if (entity.getDefaultAvailability() != null) {
			String defaultAvailability = entity.getDefaultAvailability();
			defaultAvailability = defaultAvailability.replaceAll("\\[", "");
			defaultAvailability = defaultAvailability.replaceAll("\\]", "");

			this.defaultAvailability = Arrays.asList(defaultAvailability.split(","));
		}

		for (CalendarDayEntity cde : entity.getDays()) {
			this.days.getRows().add(new CalendarDayBO(cde));
		}

		for (CalendarEntity child : entity.getChildren()) {
			this.children.add(new CalendarBO(child));
		}
	}

	@JsonProperty(value = "PhantomId")
	public String getPhantomId() {
		return phantomId;
	}

	@JsonIgnore
	public void setPhantomId(String phantomId) {
		this.phantomId = phantomId;
	}

	@JsonProperty(value = "Id")
	public Integer getId() {
		return id;
	}

	@JsonIgnore
	public void setId(Integer id) {
		this.id = id;
	}

	@JsonProperty(value = "parentId")
	public String getParentId() {
		return parentId;
	}

	@JsonIgnore
	public void setParentId(String parentId) {
		this.parentId = parentId;
	}

	@JsonProperty(value = "leaf")
	public Boolean getLeaf() {
		return leaf;
	}

	@JsonIgnore
	public void setLeaf(Boolean leaf) {
		this.leaf = leaf;
	}

	@JsonProperty(value = "Name")
	public String getName() {
		return name;
	}

	@JsonIgnore
	public void setName(String name) {
		this.name = name;
	}

	@JsonProperty(value = "DaysPerMonth")
	public Integer getDaysPerMonth() {
		return daysPerMonth;
	}

	@JsonIgnore
	public void setDaysPerMonth(Integer daysPerMonth) {
		this.daysPerMonth = daysPerMonth;
	}

	@JsonProperty(value = "DaysPerWeek")
	public Integer getDaysPerWeek() {
		return daysPerWeek;
	}

	@JsonIgnore
	public void setDaysPerWeek(Integer daysPerWeek) {
		this.daysPerWeek = daysPerWeek;
	}

	@JsonProperty(value = "HoursPerDay")
	public Integer getHoursPerDay() {
		return hoursPerDay;
	}

	@JsonIgnore
	public void setHoursPerDay(Integer hoursPerDay) {
		this.hoursPerDay = hoursPerDay;
	}

	@JsonProperty(value = "WeekendsAreWorkdays")
	public Boolean getWeekendsAreWorkdays() {
		return weekendsAreWorkdays;
	}

	@JsonIgnore
	public void setWeekendsAreWorkdays(Boolean weekendsAreWorkdays) {
		this.weekendsAreWorkdays = weekendsAreWorkdays;
	}

	@JsonProperty(value = "WeekendFirstDay")
	public Integer getWeekendFirstDay() {
		return weekendFirstDay;
	}

	@JsonIgnore
	public void setWeekendFirstDay(Integer weekendFirstDay) {
		this.weekendFirstDay = weekendFirstDay;
	}

	@JsonProperty(value = "WeekendSecondDay")
	public Integer getWeekendSecondDay() {
		return weekendSecondDay;
	}

	@JsonIgnore
	public void setWeekendSecondDay(Integer weekendSecondDay) {
		this.weekendSecondDay = weekendSecondDay;
	}

	@JsonProperty(value = "DefaultAvailability")
	public List<String> getDefaultAvailability() {
		return defaultAvailability;
	}

	public void setDefaultAvailability(List<String> defaultAvailability) {
		this.defaultAvailability = defaultAvailability;
	}

	public SegmentSummaryBO<CalendarDayBO> getDays() {
		return days;
	}

	public void setDays(SegmentSummaryBO<CalendarDayBO> days) {
		this.days = days;
	}

	@JsonProperty(value = "CalendarClass")
	public String getCalendarClass() {
		return calendarClass;
	}

	@JsonIgnore
	public void setCalendarClass(String calendarClass) {
		this.calendarClass = calendarClass;
	}

	@JsonProperty(value = "PhantomParentId")
	public String getPhantomParentId() {
		return phantomParentId;
	}

	@JsonIgnore
	public void setPhantomParentId(String phantomParentId) {
		this.phantomParentId = phantomParentId;
	}

	public List<CalendarBO> getChildren() {
		return children;
	}

	public void setChildren(List<CalendarBO> children) {
		this.children = children;
	}

}
