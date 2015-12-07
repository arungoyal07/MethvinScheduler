package methvin.scheduler.entities;

import java.util.Date;
import java.util.HashSet;
import java.util.Set;

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
import javax.persistence.Transient;

/**
 * Entity for Task object
 * 
 * @author dkomarch
 *
 */
@Entity
@Table(name = "planning_task")
public class TaskEntity extends BaseEntity {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;
	@Transient
	private String phantomId;
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "parentId", nullable = true)
	private TaskEntity parent;
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "projectId", nullable = false)
	private ProjectEntity project;
	@Column(name = "ind")
	private Integer index;
	@Column(nullable = false)
	private Boolean expanded;
	@Column(nullable = false)
	private Boolean leaf;
	private String color;
	private Boolean showInTimeline;
	private Date startDate;
	private Date endDate;
	private String cls;
	private String name;
	private Double duration;
	private Integer effort;
	private String effortUnit;
	private String calendarId;
	private String note;
	private String durationUnit;
	private Double percentDone;
	private String constraintType;
	private Date constraintDate;
	private Boolean manuallyScheduled;
	private String schedulingMode;
	private Date baselineStartDate;
	private Date baselineEndDate;
	private Double baselinePercentDone;
	private Boolean rollup;
	@Transient
	private String phantomParentId;

	@OneToMany(mappedBy = "parent", fetch = FetchType.LAZY)
	private Set<TaskEntity> children = new HashSet<TaskEntity>();
	@OneToMany(mappedBy = "task", fetch = FetchType.LAZY)
	private Set<TaskSegmentEntity> segments = new HashSet<TaskSegmentEntity>();

	@OneToMany(fetch = FetchType.LAZY, mappedBy = "to", cascade = { CascadeType.REMOVE })
	private Set<DependencyEntity> toList = new HashSet<DependencyEntity>();
	@OneToMany(fetch = FetchType.LAZY, mappedBy = "from", cascade = { CascadeType.REMOVE })
	private Set<DependencyEntity> fromList = new HashSet<DependencyEntity>();

	@OneToMany(mappedBy = "task", fetch = FetchType.LAZY, cascade = { CascadeType.REMOVE })
	private Set<AssignmentEntity> assignments = new HashSet<AssignmentEntity>();

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public String getPhantomId() {
		return phantomId;
	}

	public void setPhantomId(String phantomId) {
		this.phantomId = phantomId;
	}

	public TaskEntity getParent() {
		return parent;
	}

	public void setParent(TaskEntity parent) {
		this.parent = parent;
	}

	public ProjectEntity getProject() {
		return project;
	}

	public void setProject(ProjectEntity project) {
		this.project = project;
	}

	public Integer getIndex() {
		return index;
	}

	public void setIndex(Integer index) {
		this.index = index;
	}

	public Boolean getExpanded() {
		return expanded;
	}

	public void setExpanded(Boolean expanded) {
		this.expanded = expanded;
	}

	public Boolean getLeaf() {
		return leaf;
	}

	public void setLeaf(Boolean leaf) {
		this.leaf = leaf;
	}

	public String getColor() {
		return color;
	}

	public void setColor(String color) {
		this.color = color;
	}

	public Boolean getShowInTimeline() {
		return showInTimeline;
	}

	public void setShowInTimeline(Boolean showInTimeline) {
		this.showInTimeline = showInTimeline;
	}

	public Date getStartDate() {
		return startDate;
	}

	public void setStartDate(Date startDate) {
		this.startDate = startDate;
	}

	public Date getEndDate() {
		return endDate;
	}

	public void setEndDate(Date endDate) {
		this.endDate = endDate;
	}

	public String getCls() {
		return cls;
	}

	public void setCls(String cls) {
		this.cls = cls;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public Double getDuration() {
		return duration;
	}

	public void setDuration(Double duration) {
		this.duration = duration;
	}

	public Integer getEffort() {
		return effort;
	}

	public void setEffort(Integer effort) {
		this.effort = effort;
	}

	public String getEffortUnit() {
		return effortUnit;
	}

	public void setEffortUnit(String effortUnit) {
		this.effortUnit = effortUnit;
	}

	public String getCalendarId() {
		return calendarId;
	}

	public void setCalendarId(String calendarId) {
		this.calendarId = calendarId;
	}

	public String getNote() {
		return note;
	}

	public void setNote(String note) {
		this.note = note;
	}

	public String getDurationUnit() {
		return durationUnit;
	}

	public void setDurationUnit(String durationUnit) {
		this.durationUnit = durationUnit;
	}

	public Double getPercentDone() {
		return percentDone;
	}

	public void setPercentDone(Double percentDone) {
		this.percentDone = percentDone;
	}

	public String getConstraintType() {
		return constraintType;
	}

	public void setConstraintType(String constraintType) {
		this.constraintType = constraintType;
	}

	public Date getConstraintDate() {
		return constraintDate;
	}

	public void setConstraintDate(Date constraintDate) {
		this.constraintDate = constraintDate;
	}

	public Boolean getManuallyScheduled() {
		return manuallyScheduled;
	}

	public void setManuallyScheduled(Boolean manuallyScheduled) {
		this.manuallyScheduled = manuallyScheduled;
	}

	public String getSchedulingMode() {
		return schedulingMode;
	}

	public void setSchedulingMode(String schedulingMode) {
		this.schedulingMode = schedulingMode;
	}

	public Date getBaselineStartDate() {
		return baselineStartDate;
	}

	public void setBaselineStartDate(Date baselineStartDate) {
		this.baselineStartDate = baselineStartDate;
	}

	public Date getBaselineEndDate() {
		return baselineEndDate;
	}

	public void setBaselineEndDate(Date baselineEndDate) {
		this.baselineEndDate = baselineEndDate;
	}

	public Double getBaselinePercentDone() {
		return baselinePercentDone;
	}

	public void setBaselinePercentDone(Double baselinePercentDone) {
		this.baselinePercentDone = baselinePercentDone;
	}

	public Boolean getRollup() {
		return rollup;
	}

	public void setRollup(Boolean rollup) {
		this.rollup = rollup;
	}

	public String getPhantomParentId() {
		return phantomParentId;
	}

	public void setPhantomParentId(String phantomParentId) {
		this.phantomParentId = phantomParentId;
	}

	public Set<TaskEntity> getChildren() {
		return children;
	}

	public void setChildren(Set<TaskEntity> children) {
		this.children = children;
	}

	public Set<TaskSegmentEntity> getSegments() {
		return segments;
	}

	public void setSegments(Set<TaskSegmentEntity> segments) {
		this.segments = segments;
	}

	public Set<DependencyEntity> getToList() {
		return toList;
	}

	public void setToList(Set<DependencyEntity> toList) {
		this.toList = toList;
	}

	public Set<DependencyEntity> getFromList() {
		return fromList;
	}

	public void setFromList(Set<DependencyEntity> fromList) {
		this.fromList = fromList;
	}

	public Set<AssignmentEntity> getAssignments() {
		return assignments;
	}

	public void setAssignments(Set<AssignmentEntity> assignments) {
		this.assignments = assignments;
	}
}
