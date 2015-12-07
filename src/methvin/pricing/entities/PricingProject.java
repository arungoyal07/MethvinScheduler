package methvin.pricing.entities;
import java.util.List;

import javax.persistence.Entity;
import javax.persistence.Table;
import javax.persistence.Transient;

@SuppressWarnings("serial")
@Entity
@Table(name = "pricing_project")
public class PricingProject extends PricingHierarchyBase {

	private String description;
	private int type;
	private int vendorId;
	private double markup;
	private int createdBy;
	private int companyId;
	private int tenderId;
	private int referedTenderId;
	private int isPublished;
	private boolean expanded;
	
	@Transient
	public List<PricingProject> children;
	@Transient
	private boolean leaf= true;
	
	
	public boolean getLeaf() {
		return leaf;
	}
	public boolean getExpanded() {
		return expanded;
	}
	public void setExpanded(boolean expanded) {
		this.expanded = expanded;
	}
	public void setLeaf(boolean leaf) {
		this.leaf = leaf;
	}
	
	public int getIsPublished() {
		return isPublished;
	}
	public void setIsPublished(int isPublished) {
		this.isPublished = isPublished;
	}
	public int getClientId() {
		return clientId;
	}
	public void setClientId(int clientId) {
		this.clientId = clientId;
	}
	@Transient
	private int clientId;
	
	public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
	}
	public int getType() {
		return type;
	}
	public void setType(int type) {
		this.type = type;
	}
	public int getVendorId() {
		return vendorId;
	}
	public void setVendorId(int vendorId) {
		this.vendorId = vendorId;
	}
	public double getMarkup() {
		return markup;
	}
	public void setMarkup(double markup) {
		this.markup = markup;
	}
	public int getCreatedBy() {
		return createdBy;
	}
	public void setCreatedBy(int createdBy) {
		this.createdBy = createdBy;
	}
	public int getCompanyId() {
		return companyId;
	}
	public void setCompanyId(int companyId) {
		this.companyId = companyId;
	}
	public int getTenderId() {
		return tenderId;
	}
	public void setTenderId(int tenderId) {
		this.tenderId = tenderId;
	}
	public int getReferedTenderId() {
		return referedTenderId;
	}
	public void setReferedTenderId(int referedTenderId) {
		this.referedTenderId = referedTenderId;
	}
}
