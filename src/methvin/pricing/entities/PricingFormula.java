package methvin.pricing.entities;

import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;
import javax.persistence.Transient;

@SuppressWarnings("serial")
@Entity
@Table(name = "pricing_pricingformula")
public class PricingFormula extends PricingHierarchyBase{

	private int taskId;
	private String description;
	private	int projectId; 
	private	Integer resourceId;
	private	double  resourceRate;
	private	String variable;
	private double quantity;
	private	String equation;
	private	double value; 
	private	double rate;
	@Column(nullable = false)
	private boolean expanded;
	private String color;
	private String cls;
	@Transient
	private boolean leaf;
	@Transient
	private int clientId;
	@Transient
	public List<PricingFormula> children;
	
	public int getTaskId() {
		return taskId;
	}
	public void setTaskId(int taskId) {
		this.taskId = taskId;
	}
	public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
	}
	public int getProjectId() {
		return projectId;
	}
	public void setProjectId(int projectid) {
		this.projectId = projectid;
	}
	public Integer getResourceId() {
		return resourceId;
	}
	public void setResourceId(Integer resourceId) {
		this.resourceId = resourceId;
	}
	public double getResourceRate() {
		return resourceRate;
	}
	public void setResourceRate(double resourceRate) {
		this.resourceRate = resourceRate;
	}
	public String getVariable() {
		return variable;
	}
	public void setVariable(String variable) {
		this.variable = variable;
	}
	public double getQuantity() {
		return quantity;
	}
	public void setQuantity(double quantity) {
		this.quantity = quantity;
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
	public double getRate() {
		return rate;
	}
	public void setRate(double rate) {
		this.rate = rate;
	}
	public boolean isExpanded() {
		return expanded;
	}
	public void setExpanded(boolean expanded) {
		this.expanded = expanded;
	}
	public String getColor() {
		return color;
	}
	public void setColor(String color) {
		this.color = color;
	}
	public String getCls() {
		return cls;
	}
	public void setCls(String cls) {
		this.cls = cls;
	}
	public boolean getLeaf() {
		return true;
	}
	public void setLeaf(boolean leaf) {
		this.leaf = leaf;
	}
	public void setClientId(int clientId){
		this.clientId=clientId;
	}
	public int getClientId(){
		return this.clientId;
	}
	
}
