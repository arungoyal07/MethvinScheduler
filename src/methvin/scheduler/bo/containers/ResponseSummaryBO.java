package methvin.scheduler.bo.containers;

import java.util.List;

import methvin.scheduler.bo.AssignmentBO;
import methvin.scheduler.bo.CalendarBO;
import methvin.scheduler.bo.DependencyBO;
import methvin.scheduler.bo.ResourceBO;
import methvin.scheduler.bo.TaskBO;

import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * Response BO that collects all the data in desired format
 * 
 * 
 *
 */
public class ResponseSummaryBO {
	@JsonProperty(value = "success")
	private Boolean success;
	@JsonProperty(value = "type")
	private String type;
	@JsonProperty(value = "requestId")
	private Long requestId;
	@JsonProperty(value = "tasks")
	private Tasks tasks = new Tasks();
	@JsonProperty(value = "dependencies")
	private Dependencies dependencies = new Dependencies();
	@JsonProperty(value = "calendars")
	private Calendars calendars = new Calendars();
	@JsonProperty(value = "resources")
	private Resources resources = new Resources();
	@JsonProperty(value = "assignments")
	private Assignments assignments = new Assignments();

	public Boolean getSuccess() {
		return success;
	}

	public void setSuccess(Boolean success) {
		this.success = success;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public Long getRequestId() {
		return requestId;
	}

	public void setRequestId(Long requestId) {
		this.requestId = requestId;
	}

	public Tasks getTasks() {
		return tasks;
	}

	public void setTasks(Tasks tasks) {
		this.tasks = tasks;
	}

	public Dependencies getDependencies() {
		return dependencies;
	}

	public void setDependencies(Dependencies dependencies) {
		this.dependencies = dependencies;
	}

	public Calendars getCalendars() {
		return calendars;
	}

	public void setCalendars(Calendars calendars) {
		this.calendars = calendars;
	}

	public Resources getResources() {
		return resources;
	}

	public void setResources(Resources resources) {
		this.resources = resources;
	}

	public Assignments getAssignments() {
		return assignments;
	}

	public void setAssignments(Assignments assignments) {
		this.assignments = assignments;
	}

	/**
	 * Wrapper class for tasks section in response
	 * 
	 * @author dkomarch
	 *
	 */
	public class Tasks {
		@JsonProperty(value = "rows")
		private List<TaskBO> data;

		public List<TaskBO> getData() {
			return data;
		}

		public void setData(List<TaskBO> tasks) {
			this.data = tasks;
		}
	}

	/**
	 * Wrapper class for dependencies section in response
	 * 
	 * @author dkomarch
	 *
	 */
	public class Dependencies {
		@JsonProperty(value = "rows")
		private List<DependencyBO> data;

		public List<DependencyBO> getData() {
			return data;
		}

		public void setData(List<DependencyBO> dependencies) {
			this.data = dependencies;
		}
	}

	/**
	 * Wrapper class for calendars section in response
	 * 
	 * @author dkomarch
	 *
	 */
	public class Calendars {
		@JsonProperty(value = "metaData")
		private CalendarMetaData metaData;
		@JsonProperty(value = "rows")
		private List<CalendarBO> data;

		public List<CalendarBO> getData() {
			return data;
		}

		public void setData(List<CalendarBO> calendars) {
			this.data = calendars;
			this.metaData = new CalendarMetaData(calendars.get(0).getId());
		}

		public class CalendarMetaData {
			@JsonProperty(value = "projectCalendar")
			private Integer projectCalendar;

			public CalendarMetaData(Integer projectCalendar) {
				this.projectCalendar = projectCalendar;
			}

			public Integer getProjectCalendar() {
				return projectCalendar;
			}

			public void setProjectCalendar(Integer projectCalendar) {
				this.projectCalendar = projectCalendar;
			}
		}
	}

	/**
	 * Wrapper class for assignments section in response
	 * 
	 * @author dkomarch
	 *
	 */
	public class Resources {
		@JsonProperty(value = "rows")
		private List<ResourceBO> data;

		public List<ResourceBO> getData() {
			return data;
		}

		public void setData(List<ResourceBO> calendars) {
			this.data = calendars;
		}
	}

	/**
	 * Wrapper class for assignments section in response
	 * 
	 * @author dkomarch
	 *
	 */
	public class Assignments {
		@JsonProperty(value = "rows")
		private List<AssignmentBO> data;

		public List<AssignmentBO> getData() {
			return data;
		}

		public void setData(List<AssignmentBO> calendars) {
			this.data = calendars;
		}
	}
}
