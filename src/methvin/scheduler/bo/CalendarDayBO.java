package methvin.scheduler.bo;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

import methvin.scheduler.entities.CalendarDayEntity;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * BO for calendar days
 * 
 *
 */
public class CalendarDayBO extends BaseBO {
	@JsonIgnore
	protected Integer id;
	@JsonIgnore
	protected Date date;
	@JsonIgnore
	protected Integer weekday;
	@JsonIgnore
	protected Date overrideStartDate;
	@JsonIgnore
	protected Date overrideEndDate;
	@JsonIgnore
	protected String type;
	@JsonIgnore
	protected Boolean isWorkingDay;
	@JsonIgnore
	protected String cls;
	@JsonIgnore
	protected String name;
	@JsonIgnore
	protected List<String> availability = new ArrayList<String>();

	public CalendarDayBO() {
	}

	public CalendarDayBO(CalendarDayEntity entity) {
		super(entity);

		if (entity.getAvailability() != null) {
			String Availability = entity.getAvailability();
			Availability = Availability.replaceAll("\\[", "");
			Availability = Availability.replaceAll("\\]", "");

			this.availability = Arrays.asList(Availability.split(","));
		}
	}

	@JsonProperty(value = "Id")
	public Integer getId() {
		return id;
	}

	@JsonIgnore
	public void setId(Integer id) {
		this.id = id;
	}

	@JsonProperty(value = "Date")
	@JsonFormat(pattern = DATETIME_PATTERN)
	public Date getDate() {
		return date;
	}

	@JsonIgnore
	public void setDate(Date date) {
		this.date = date;
	}

	@JsonProperty(value = "Weekday")
	public Integer getWeekday() {
		return weekday;
	}

	@JsonIgnore
	public void setWeekday(Integer weekday) {
		this.weekday = weekday;
	}

	@JsonProperty(value = "OverrideStartDate")
	@JsonFormat(pattern = DATETIME_PATTERN)
	public Date getOverrideStartDate() {
		return overrideStartDate;
	}

	@JsonIgnore
	public void setOverrideStartDate(Date overrideStartDate) {
		this.overrideStartDate = overrideStartDate;
	}

	@JsonProperty(value = "OverrideEndDate")
	@JsonFormat(pattern = DATETIME_PATTERN)
	public Date getOverrideEndDate() {
		return overrideEndDate;
	}

	@JsonIgnore
	public void setOverrideEndDate(Date overrideEndDate) {
		this.overrideEndDate = overrideEndDate;
	}

	@JsonProperty(value = "Type")
	public String getType() {
		return type;
	}

	@JsonIgnore
	public void setType(String type) {
		this.type = type;
	}

	@JsonProperty(value = "IsWorkingDay")
	public Boolean getIsWorkingDay() {
		return isWorkingDay;
	}

	@JsonIgnore
	public void setIsWorkingDay(Boolean isWorkingDay) {
		this.isWorkingDay = isWorkingDay;
	}

	@JsonProperty(value = "Cls")
	public String getCls() {
		return cls;
	}

	@JsonIgnore
	public void setCls(String cls) {
		this.cls = cls;
	}

	@JsonProperty(value = "Name")
	public String getName() {
		return name;
	}

	@JsonIgnore
	public void setName(String name) {
		this.name = name;
	}

	@JsonProperty(value = "Availability")
	public List<String> getAvailability() {
		return availability;
	}

	@JsonIgnore
	public void setAvailability(List<String> availability) {
		this.availability = availability;
	}

}
