package methvin.scheduler.entities;

import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.persistence.Transient;

/**
 * Entity for dependency
 *
 */

@Entity
@Table(name = "planning_dependency")
public class DependencyEntity extends BaseEntity {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "fromId", nullable = false)
	private TaskEntity from;
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "toId", nullable = false)
	private TaskEntity to;
	private Integer type;
	private String cls;
	private Integer lag;
	private String lagUnit;
	@Transient
	private String phantomFrom;
	@Transient
	private String phantomTo;
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "projectId", nullable = false)
	private ProjectEntity project;

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public TaskEntity getFrom() {
		return from;
	}

	public void setFrom(TaskEntity from) {
		this.from = from;
	}

	public TaskEntity getTo() {
		return to;
	}

	public void setTo(TaskEntity to) {
		this.to = to;
	}

	public Integer getType() {
		return type;
	}

	public void setType(Integer type) {
		this.type = type;
	}

	public String getCls() {
		return cls;
	}

	public void setCls(String cls) {
		this.cls = cls;
	}

	public Integer getLag() {
		return lag;
	}

	public void setLag(Integer lag) {
		this.lag = lag;
	}

	public String getLagUnit() {
		return lagUnit;
	}

	public void setLagUnit(String lagUnit) {
		this.lagUnit = lagUnit;
	}

	public String getPhantomFrom() {
		return phantomFrom;
	}

	public void setPhantomFrom(String phantomFrom) {
		this.phantomFrom = phantomFrom;
	}

	public String getPhantomTo() {
		return phantomTo;
	}

	public void setPhantomTo(String phantomTo) {
		this.phantomTo = phantomTo;
	}

	public ProjectEntity getProject() {
		return project;
	}

	public void setProject(ProjectEntity project) {
		this.project = project;
	}

}
