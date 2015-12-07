package methvin.scheduler.bo;

import java.util.Date;

import com.fasterxml.jackson.annotation.JsonIgnore;

/**
 * Business object for task segments
 * 
 *
 */
public class TaskSegmentBO extends BaseBO {
	@JsonIgnore
	protected Integer id;
	@JsonIgnore
	protected Integer taskId;
	@JsonIgnore
	protected Date startDate;
	@JsonIgnore
	protected Date endDate;
	@JsonIgnore
	protected Double duration;
	@JsonIgnore
	protected String durationUnit;
	@JsonIgnore
	protected String cls;

	public Integer getId() {
		return id;
	}

	@JsonIgnore
	public void setId(Integer id) {
		this.id = id;
	}

	public Integer getTaskId() {
		return taskId;
	}

	@JsonIgnore
	public void setTaskId(Integer taskId) {
		this.taskId = taskId;
	}

	public Date getStartDate() {
		return startDate;
	}

	@JsonIgnore
	public void setStartDate(Date startDate) {
		this.startDate = startDate;
	}

	public Date getEndDate() {
		return endDate;
	}

	@JsonIgnore
	public void setEndDate(Date endDate) {
		this.endDate = endDate;
	}

	public Double getDuration() {
		return duration;
	}

	@JsonIgnore
	public void setDuration(Double duration) {
		this.duration = duration;
	}

	public String getDurationUnit() {
		return durationUnit;
	}

	@JsonIgnore
	public void setDurationUnit(String durationUnit) {
		this.durationUnit = durationUnit;
	}

	public String getCls() {
		return cls;
	}

	@JsonIgnore
	public void setCls(String cls) {
		this.cls = cls;
	}
}
