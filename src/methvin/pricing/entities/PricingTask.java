package methvin.pricing.entities;

import java.util.Date;
import java.util.List;

import javax.persistence.Entity;
import javax.persistence.Table;
import javax.persistence.Transient;

@SuppressWarnings("serial")
@Entity
@Table(name = "pricing_task")
public class PricingTask extends PricingHierarchyBase{

	private int projectId;
	private int levelId;
	private String item;
	private String description;
	private String color = "";
	private String unit;
	private String cls ="";
	
	private double quantity;
	private double costRate;
	private double costAmount;
	private double grossRate;
	private double grossAmount;	
	private double markup;
	
	private boolean isLocked;
	private boolean isSubScheduler;
	private boolean expanded;
	
	private Date createdOn;
	private Date modifiedOn;
	
	private Integer vendorId;
	private Integer linkedTaskId;
	private Integer noteId;
	private Integer tagId;
	
	@Transient
	private boolean leaf = true;
	@Transient
	public List<PricingTask> children;
	@Transient
	private int clientId;
	public int getProjectId() {
		return projectId;
	}
	public void setProjectId(int projectId) {
		this.projectId = projectId;
	}
	public int getLevelId() {
		return levelId;
	}
	public void setLevelId(int levelId) {
		this.levelId = levelId;
	}
	public String getItem() {
		return item;
	}
	public void setItem(String item) {
		this.item = item;
	}
	public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
	}
	public String getColor() {
		return color;
	}
	public void setColor(String color) {
		this.color = color;
	}
	public String getUnit() {
		return unit;
	}
	public void setUnit(String unit) {
		this.unit = unit;
	}
	public String getCls() {
		return cls;
	}
	public void setCls(String cls) {
		this.cls = cls;
	}
	public double getQuantity() {
		return quantity;
	}
	public void setQuantity(double quantity) {
		this.quantity = quantity;
	}
	public double getCostRate() {
		return costRate;
	}
	public void setCostRate(double costRate) {
		this.costRate = costRate;
	}
	public double getCostAmount() {
		return costAmount;
	}
	public void setCostAmount(double costAmount) {
		this.costAmount = costAmount;
	}
	public double getGrossRate() {
		return grossRate;
	}
	public void setGrossRate(double grossRate) {
		this.grossRate = grossRate;
	}
	public double getGrossAmount() {
		return grossAmount;
	}
	public void setGrossAmount(double grossAmount) {
		this.grossAmount = grossAmount;
	}
	public double getMarkup() {
		return markup;
	}
	public void setMarkup(double markup) {
		this.markup = markup;
	}
	public boolean getLocked() {
		return isLocked;
	}
	public void setLocked(boolean isLocked) {
		this.isLocked = isLocked;
	}
	public boolean getIsSubScheduler() {
		return isSubScheduler;
	}
	public void setIsSubScheduler(boolean isSubScheduler) {
		this.isSubScheduler = isSubScheduler;
	}
	public boolean getExpanded() {
		return expanded;
	}
	public void setExpanded(boolean expanded) {
		this.expanded = expanded;
	}
	public Date getCreatedOn() {
		return createdOn;
	}
	public void setCreatedOn(Date createdOn) {
		this.createdOn = createdOn;
	}
	public Date getModifiedOn() {
		return modifiedOn;
	}
	public void setModifiedOn(Date modifiedOn) {
		this.modifiedOn = modifiedOn;
	}
	public Integer getVendorId() {
		return vendorId;
	}
	public void setVendorId(Integer vendorId) {
		this.vendorId = vendorId;
	}
	public Integer getLinkedTaskId() {
		return linkedTaskId;
	}
	public void setLinkedTaskId(Integer linkedTaskId) {
		this.linkedTaskId = linkedTaskId;
	}
	public Integer getNoteId() {
		return noteId;
	}
	public void setNoteId(Integer noteId) {
		this.noteId = noteId;
	}
	public Integer getTagId() {
		return tagId;
	}
	public void setTagId(Integer tagId) {
		this.tagId = tagId;
	}
	public boolean getLeaf() {
		return leaf;
	}
	public void setLeaf(boolean leaf) {
		this.leaf = leaf;
	}
	public List<PricingTask> getChildren() {
		return children;
	}
	public void setChildren(List<PricingTask> children) {
		this.children = children;
	}
	public int getClientId() {
		return clientId;
	}
	public void setClientId(int clientId) {
		this.clientId = clientId;
	}
	
	
		
}
