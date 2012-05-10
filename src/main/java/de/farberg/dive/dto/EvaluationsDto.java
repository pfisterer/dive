package de.farberg.dive.dto;

import java.util.LinkedList;
import java.util.List;

import javax.xml.bind.annotation.XmlRootElement;

import de.farberg.dive.lectures.Evaluation;

@XmlRootElement
public class EvaluationsDto {
	public String stringModuleName;

	public List<Evaluation> evaluations = new LinkedList<>();
}
