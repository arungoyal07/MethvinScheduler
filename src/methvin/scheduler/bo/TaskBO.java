package methvin.scheduler.bo;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import methvin.scheduler.entities.TaskEntity;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonView;

/**
 * Representation of Task section of given JSON
 * 
 *
 *
 */
@JsonInclude(content = Include.NON_NULL)
public class TaskBO extends BaseBO {
	@JsonIgnore
	protected Integer id;
	@JsonIgnore
	protected String parentId;
	@JsonIgnore
	protected Integer index;
	@JsonIgnore
	protected Boolean expanded;
	@JsonIgnore
	protected Boolean leaf;
	@JsonIgnore
	protected String color;
	@JsonIgnore
	protected Boolean showInTimeline;
	@JsonIgnore
	protected Date startDate;
	@JsonIgnore
	protected Date endDate;
	@JsonIgnore
	protected String cls;
	@JsonIgnore
	protected String name;
	@JsonIgnore
	protected Double duration;
	@JsonIgnore
	protected Integer effort;
	@JsonIgnore
	protected String effortUnit;
	@JsonIgnore
	protected String calendarId;
	@JsonIgnore
	protected String note;
	@JsonIgnore
	protected String durationUnit;
	@JsonIgnore
	protected Double percentDone;
	@JsonIgnore
	protected String constraintType;
	@JsonIgnore
	protected Date constraintDate;
	@JsonIgnore
	protected Boolean manuallyScheduled;
	@JsonIgnore
	protected String schedulingMode;
	@JsonIgnore
	protected Date baselineStartDate;
	@JsonIgnore
	protected Date baselineEndDate;
	@JsonIgnore
	protected Double baselinePercentDone;
	@JsonIgnore
	protected Boolean rollup;
	@JsonIgnore
	protected String phantomParentId;

	@JsonProperty(value = "Segments")
	protected List<TaskSegmentBO> segments = new ArrayList<TaskSegmentBO>();
	@JsonProperty(value = "children")
	@JsonView(value = BaseBO.ResponseView.class)
	protected List<TaskBO> children = new ArrayList<TaskBO>();

	public TaskBO() {

	}

	public TaskBO(TaskEntity entity) {
		super(entity);

		if (entity.getParent() != null && entity.getParent().getId() != null) {
			this.parentId = entity.getParent().getId().toString();
		}

		for (TaskEntity child : entity.getChildren()) {
			this.children.add(new TaskBO(child));
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

	@JsonProperty(value = "parentId")
	public String getParentId() {
		return parentId;
	}

	@JsonIgnore
	public void setParentId(String parentId) {
		this.parentId = parentId;
	}

	@JsonProperty(value = "index")
	public Integer getIndex() {
		return index;
	}

	@JsonIgnore
	public void setIndex(Integer index) {
		this.index = index;
	}

	@JsonProperty(value = "expanded")
	public Boolean getExpanded() {
		return expanded;
	}

	@JsonIgnore
	public void setExpanded(Boolean expanded) {
		this.expanded = expanded;
	}

	@JsonProperty(value = "leaf")
	public Boolean getLeaf() {
		return leaf;
	}

	@JsonIgnore
	public void setLeaf(Boolean leaf) {
		this.leaf = leaf;
	}

	@JsonProperty(value = "Color")
	public String getColor() {
		return color;
	}

	@JsonIgnore
	public void setColor(String color) {
		this.color = color;
	}

	@JsonProperty(value = "ShowInTimeline")
	public Boolean getShowInTimeline() {
		return showInTimeline;
	}

	@JsonIgnore
	public void setShowInTimeline(Boolean showInTimeline) {
		this.showInTimeline = showInTimeline;
	}

	@JsonProperty(value = "StartDate")
	@JsonFormat(pattern = DATETIME_PATTERN)
	public Date getStartDate() {
		return startDate;
	}

	@JsonIgnore
	public void setStartDate(Date startDate) {
		this.startDate = startDate;
	}

	@JsonProperty(value = "EndDate")
	@JsonFormat(pattern = DATETIME_PATTERN)
	public Date getEndDate() {
		return endDate;
	}

	@JsonIgnore
	public void setEndDate(Date endDate) {
		this.endDate = endDate;
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

	@JsonProperty(value = "Duration")
	public Double getDuration() {
		return duration;
	}

	@JsonIgnore
	public void setDuration(Double duration) {
		this.duration = duration;
	}

	@JsonProperty(value = "Effort")
	public Integer getEffort() {
		return effort;
	}

	@JsonIgnore
	public void setEffort(Integer effort) {
		this.effort = effort;
	}

	@JsonProperty(value = "EffortUnit")
	public String getEffortUnit() {
		return effortUnit;
	}

	@JsonIgnore
	public void setEffortUnit(String effortUnit) {
		this.effortUnit = effortUnit;
	}

	@JsonProperty(value = "CalendarId")
	public String getCalendarId() {
		return calendarId;
	}

	@JsonIgnore
	public void setCalendarId(String calendarId) {
		this.calendarId = calendarId;
	}

	@JsonProperty(value = "Note")
	public String getNote() {
		return note;
	}

	@JsonIgnore
	public void setNote(String note) {
		this.note = note;
	}

	@JsonProperty(value = "DurationUnit")
	public String getDurationUnit() {
		return durationUnit;
	}

	@JsonIgnore
	public void setDurationUnit(String durationUnit) {
		this.durationUnit = durationUnit;
	}

	@JsonProperty(value = "PercentDone")
	public Double getPercentDone() {
		return percentDone;
	}

	@JsonIgnore
	public void setPercentDone(Double percentDone) {
		this.percentDone = percentDone;
	}

	@JsonProperty(value = "ConstraintType")
	public String getConstraintType() {
		return constraintType;
	}

	@JsonIgnore
	public void setConstraintType(String constraintType) {
		this.constraintType = constraintType;
	}

	@JsonFormat(pattern = DATETIME_PATTERN)
	@JsonProperty(value = "ConstraintDate")
	public Date getConstraintDate() {
		return constraintDate;
	}

	@JsonIgnore
	public void setConstraintDate(Date constraintDate) {
		this.constraintDate = constraintDate;
	}

	@JsonProperty(value = "ManuallyScheduled")
	public Boolean getManuallyScheduled() {
		return manuallyScheduled;
	}

	@JsonIgnore
	public void setManuallyScheduled(Boolean manuallyScheduled) {
		this.manuallyScheduled = manuallyScheduled;
	}

	@JsonProperty(value = "SchedulingMode")
	public String getSchedulingMode() {
		return schedulingMode;
	}

	@JsonIgnore
	public void setSchedulingMode(String schedulingMode) {
		this.schedulingMode = schedulingMode;
	}

	@JsonFormat(pattern = DATETIME_PATTERN)
	@JsonProperty(value = "BaselineStartDate")
	public Date getBaselineStartDate() {
		return baselineStartDate;
	}

	@JsonIgnore
	public void setBaselineStartDate(Date baselineStartDate) {
		this.baselineStartDate = baselineStartDate;
	}

	@JsonFormat(pattern = DATETIME_PATTERN)
	@JsonProperty(value = "BaselineEndDate")
	public Date getBaselineEndDate() {
		return baselineEndDate;
	}

	@JsonIgnore
	public void setBaselineEndDate(Date baselineEndDate) {
		this.baselineEndDate = baselineEndDate;
	}

	@JsonProperty(value = "BaselinePercentDone")
	public Double getBaselinePercentDone() {
		return baselinePercentDone;
	}

	@JsonIgnore
	public void setBaselinePercentDone(Double baselinePercentDone) {
		this.baselinePercentDone = baselinePercentDone;
	}

	@JsonProperty(value = "Rollup")
	public Boolean getRollup() {
		return rollup;
	}

	@JsonIgnore
	public void setRollup(Boolean rollup) {
		this.rollup = rollup;
	}

	@JsonProperty(value = "PhantomParentId")
	public String getPhantomParentId() {
		return phantomParentId;
	}

	@JsonIgnore
	public void setPhantomParentId(String phantomParentId) {
		this.phantomParentId = phantomParentId;
	}

	public List<TaskSegmentBO> getSegments() {
		return segments;
	}

	public void setSegments(List<TaskSegmentBO> segments) {
		this.segments = segments;
	}

	public List<TaskBO> getChildren() {
		return children;
	}

	public void setChildren(List<TaskBO> children) {
		this.children = children;
	}
}
