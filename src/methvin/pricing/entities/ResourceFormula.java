package methvin.pricing.entities;
import javax.persistence.Entity;
import javax.persistence.Table;
import javax.persistence.Transient;

@SuppressWarnings("serial")
@Entity
@Table(name = "pricing_resourceformulae")
public class ResourceFormula extends PricingHierarchyBase{
	private	int projectId ; 
	private int parentResourceId;
	private int resourceId;
	private	double resourceRate;
	private String unit="";
	private	String variable; 
	private	String equation; 
	private	double value;  
	private	double amount;
	private	String description; 
	private boolean expanded;
	private String cls;
	private String color;
	@Transient
	private boolean leaf = true;
	public int getProjectId() {
		return projectId;
	}
	public void setProjectId(int projectId) {
		this.projectId = projectId;
	}
	public int getParentResourceId() {
		return parentResourceId;
	}
	public void setParentResourceId(int parentResourceId) {
		this.parentResourceId = parentResourceId;
	}
	public int getResourceId() {
		return resourceId;
	}
	public void setResourceId(int resourceId) {
		this.resourceId = resourceId;
	}
	public double getResourceRate() {
		return resourceRate;
	}
	public void setResourceRate(double resourceRate) {
		this.resourceRate = resourceRate;
	}
	public String getUnit() {
		return unit;
	}
	public void setUnit(String unit) {
		this.unit = unit;
	}
	public String getVariable() {
		return variable;
	}
	public void setVariable(String variable) {
		this.variable = variable;
	}
	public String getEquation() {
		return equation;
	}
	public void setEquation(String equation) {
		this.equation = equation;
	}
	public double getValue() {
		return value;
	}
	public void setValue(double value) {
		this.value = value;
	}
	public double getAmount() {
		return amount;
	}
	public void setAmount(double amount) {
		this.amount = amount;
	}
	public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
	}
	public boolean isExpanded() {
		return expanded;
	}
	public void setExpanded(boolean expanded) {
		this.expanded = expanded;
	}
	public String getCls() {
		return cls;
	}
	public void setCls(String cls) {
		this.cls = cls;
	}
	public String getColor() {
		return color;
	}
	public void setColor(String color) {
		this.color = color;
	}
	public boolean isLeaf() {
		return leaf;
	}
	public void setLeaf(boolean leaf) {
		this.leaf = leaf;
	}

	
}
