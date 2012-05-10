package de.farberg.dive.lectures;

import java.sql.Time;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "evaluation")
public class Evaluation {

	@Id
	@GeneratedValue(strategy = GenerationType.TABLE)
	public Integer id;
	
	public String lecture;

	public Time creationTime;

	@Column(length = 5000)
	public String encryptedContent;

	/* (non-Javadoc)
	 * @see java.lang.Object#toString()
	 */
	@Override
	public String toString() {
		StringBuilder builder = new StringBuilder();
		builder.append("Evaluation [id=");
		builder.append(id);
		builder.append(", creationTime=");
		builder.append(creationTime);
		builder.append(", encryptedContent=");
		builder.append(encryptedContent);
		builder.append("]");
		return builder.toString();
	}

}
