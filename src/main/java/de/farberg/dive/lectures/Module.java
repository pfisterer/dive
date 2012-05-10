package de.farberg.dive.lectures;

import java.util.Collection;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import org.hibernate.annotations.LazyCollection;
import org.hibernate.annotations.LazyCollectionOption;

@Entity
@Table(name = "lecture")
public class Module {

	@Id
	@Column(length = 200)
	public String name;

	public String md5OfUserKey;

	public String md5OfAdminKey;

	@OneToMany(cascade = CascadeType.ALL)
	@LazyCollection(LazyCollectionOption.FALSE)
	public Collection<Evaluation> evaluations;

	/* (non-Javadoc)
	 * @see java.lang.Object#toString()
	 */
	@Override
	public String toString() {
		StringBuilder builder = new StringBuilder();
		builder.append("Module [name=");
		builder.append(name);
		builder.append(", md5OfUserKey=");
		builder.append(md5OfUserKey);
		builder.append(", md5OfAdminKey=");
		builder.append(md5OfAdminKey);
		builder.append(", evaluations=");
		builder.append(evaluations);
		builder.append("]");
		return builder.toString();
	}

}
