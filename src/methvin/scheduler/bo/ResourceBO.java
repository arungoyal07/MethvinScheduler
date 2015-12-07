package methvin.scheduler.bo;

import methvin.scheduler.entities.ResourceEntity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * BO for resource
 * 
 *
 */
public class ResourceBO extends BaseBO {
	@JsonIgnore
	protected Integer id;
	@JsonIgnore
	protected String name;
	@JsonIgnore
	protected String type;
	@JsonIgnore
	protected Integer calendarId;
	@JsonIgnore
	protected String calendarName;
	@JsonIgnore
	protected String phantomCalendarId;

	public ResourceBO() {
	}

	public ResourceBO(ResourceEntity entity) {
		super(entity);

		if (entity.getCalendar() != null) {
			calendarId = entity.getCalendar().getId();
			calendarName = entity.getCalendar().getName();
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

	@JsonProperty(value = "Name")
	public String getName() {
		return name;
	}

	@JsonIgnore
	public void setName(String name) {
		this.name = name;
	}

	@JsonProperty(value = "Type")
	public String getType() {
		return type;
	}

	@JsonIgnore
	public void setType(String type) {
		this.type = type;
	}

	@JsonProperty(value = "CalendarId")
	public Integer getCalendarId() {
		return calendarId;
	}

	@JsonIgnore
	public void setCalendarId(Integer calendarId) {
		this.calendarId = calendarId;
	}

	@JsonProperty(value = "CalendarName")
	public String getCalendarName() {
		return calendarName;
	}

	public void setCalendarName(String calendarName) {
		this.calendarName = calendarName;
	}

	@JsonProperty(value = "PhantomCalendarId")
	public String getPhantomCalendarId() {
		return phantomCalendarId;
	}

	@JsonIgnore
	public void setPhantomCalendarId(String phantomCalendarId) {
		this.phantomCalendarId = phantomCalendarId;
	}
}
