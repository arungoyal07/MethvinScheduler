package methvin.scheduler.bo;

import methvin.scheduler.entities.AssignmentEntity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * Business object for assignments
 * 
 *
 */
public class AssignmentBO extends BaseBO {
	@JsonIgnore
	protected Integer id;
	@JsonIgnore
	protected String taskId;
	@JsonIgnore
	protected String resourceId;
	@JsonIgnore
	protected Integer units;

	public AssignmentBO() {
	}

	public AssignmentBO(AssignmentEntity entity) {
		super(entity);
		this.taskId = entity.getTask().getId().toString();
		this.resourceId = entity.getResource().getId().toString();
	}

	@JsonProperty(value = "Id")
	public Integer getId() {
		return id;
	}

	@JsonIgnore
	public void setId(Integer id) {
		this.id = id;
	}

	@JsonProperty(value = "TaskId")
	public String getTaskId() {
		return taskId;
	}

	@JsonIgnore
	public void setTaskId(String taskId) {
		this.taskId = taskId;
	}

	@JsonProperty(value = "ResourceId")
	public String getResourceId() {
		return resourceId;
	}

	@JsonIgnore
	public void setResourceId(String resourceId) {
		this.resourceId = resourceId;
	}

	@JsonProperty(value = "Units")
	public Integer getUnits() {
		return units;
	}

	@JsonIgnore
	public void setUnits(Integer units) {
		this.units = units;
	}
}
