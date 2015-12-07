package methvin.scheduler.entities;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

/**
 * Entity for projects
 * 
 * @author dkomarch
 *
 */
@Entity
@Table(name = "planning_project")
public class ProjectEntity extends BaseEntity {

	@Id
	private Integer id;

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public ProjectEntity() {

	}

	public ProjectEntity(Integer id) {
		this.id = id;
	}

}
