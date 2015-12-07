package methvin.pricing.entities;

import java.util.List;

import javax.persistence.Entity;
import javax.persistence.Table;
import javax.persistence.Transient;

@SuppressWarnings("serial")
@Entity
@Table(name = "pricing_resource")
public class PricingResource extends PricingHierarchyBase {
	private String description;
	private int ProjectId;
	private double rate;
	private String unit;
	private double resUsage;
	private double amount;
	private boolean expanded;
	private int levelId;
	private String cls;
	private String color;

	private double ownRate;
	private double baseRate;
	private int currencyId;
	private int conversionRate;

	@Transient
	private boolean leaf = true;

	@Transient
	private int clientId;

	@Transient
	public List<PricingResource> children;

	public int getClientId() {
		return clientId;
	}

	public void setClientId(int clientId) {
		this.clientId = clientId;
	}

	public String getDescription() {
		return description;
	}

	public int getProjectId() {
		return ProjectId;
	}

	public void setProjectId(int projectId) {
		ProjectId = projectId;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public double getRate() {
		return rate;
	}

	public void setRate(double rate) {
		this.rate = rate;
	}

	public String getUnit() {
		return unit;
	}

	public void setUnit(String unit) {
		this.unit = unit;
	}

	public double getResUsage() {
		return resUsage;
	}

	public void setResUsage(double resUsage) {
		this.resUsage = resUsage;
	}

	public double getAmount() {
		return amount;
	}

	public void setAmount(double amount) {
		this.amount = amount;
	}

	public boolean isExpanded() {
		return expanded;
	}

	public void setExpanded(boolean expanded) {
		this.expanded = expanded;
	}

	public int getLevelId() {
		return levelId;
	}

	public void setLevelId(int levelId) {
		this.levelId = levelId;
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

	public double getOwnRate() {
		return ownRate;
	}

	public void setOwnRate(double ownRate) {
		this.ownRate = ownRate;
	}

	public double getBaseRate() {
		return baseRate;
	}

	public void setBaseRate(double baseRate) {
		this.baseRate = baseRate;
	}

	public int getCurrencyId() {
		return currencyId;
	}

	public void setCurrencyId(int currencyId) {
		this.currencyId = currencyId;
	}

	public int getConversionRate() {
		return conversionRate;
	}

	public void setConversionRate(int conversionRate) {
		this.conversionRate = conversionRate;
	}

	public boolean isLeaf() {
		return leaf;
	}

	public void setLeaf(boolean leaf) {
		this.leaf = leaf;
	}

}
