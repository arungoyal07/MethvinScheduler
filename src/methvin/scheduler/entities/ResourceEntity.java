package methvin.scheduler.entities;

import java.util.HashSet;
import java.util.Set;

import javax.persistence.CascadeType;
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
 * Entity for resource
 * 
 * @author dkomarch
 *
 */

@Entity
@Table(name = "planning_resource")
public class ResourceEntity extends BaseEntity {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	protected Integer id;
	protected String name;
	protected String type;
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "calendarId", nullable = false)
	protected CalendarEntity calendar;
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "projectId", nullable = false)
	private ProjectEntity project;

	@OneToMany(mappedBy = "resource", fetch = FetchType.LAZY, cascade = { CascadeType.REMOVE })
	private Set<AssignmentEntity> assignments = new HashSet<AssignmentEntity>();

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public CalendarEntity getCalendar() {
		return calendar;
	}

	public void setCalendar(CalendarEntity calendar) {
		this.calendar = calendar;
	}

	public ProjectEntity getProject() {
		return project;
	}

	public void setProject(ProjectEntity project) {
		this.project = project;
	}

	public Set<AssignmentEntity> getAssignments() {
		return assignments;
	}

	public void setAssignments(Set<AssignmentEntity> assignments) {
		this.assignments = assignments;
	}

}
