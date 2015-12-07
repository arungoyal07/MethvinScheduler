package methvin.pricing.entities;
import java.io.Serializable;
import javax.persistence.MappedSuperclass;

@MappedSuperclass
public abstract class PricingHierarchyBase extends PricingBase  implements Serializable  {

	private static final long serialVersionUID = 1L;  
	
	private int parentId;
	private int sequenceId;


	
	public Integer getParentId() {
		return parentId;
	}

	public void setParentId(Integer parentId) {
		this.parentId = parentId;
	}
	
	public Integer getSequenceId() {
		return sequenceId;
	}

	public void setSequenceId(Integer sequenceId) {
		this.sequenceId = sequenceId;
	}
}
