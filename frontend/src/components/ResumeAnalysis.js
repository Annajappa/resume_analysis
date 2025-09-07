import React from "react";

const Section = ({ title, children }) => (
  <div
    style={{
      marginBottom: 20,
      padding: 12,
      borderLeft: "6px solid #1976d2",
      backgroundColor: "#f4f6f8",
      borderRadius: 6,
    }}
  >
    <h4 style={{ margin: "0 0 8px", color: "#1976d2" }}>{title}</h4>
    <div>{children}</div>
  </div>
);

export default function ResumeAnalysis({ data }) {
  if (!data) return null;

  return (
    <div style={{ marginTop: 12 }}>
      <h3 style={{ marginBottom: 4 }}>{data.name || "Unknown Candidate"}</h3>
      <p style={{ color: "#555", marginBottom: 12 }}>
        {data.email && <span>{data.email}</span>}
        <br></br>
        {data.phone && <span> • {data.phone}</span>}
        <br></br>
        {data.linkedin_url && (
          <span> • LinkedIn: <a href={data.linkedin_url} target="_blank" rel="noreferrer">{data.linkedin_url}</a></span>
        )}
        <br></br>
        {data.portfolio_url && (
          <span> • Portfolio: <a href={data.portfolio_url} target="_blank" rel="noreferrer">{data.portfolio_url}</a></span>
        )}
        <br></br>
      </p>

      {data.summary && <Section title="Summary">{data.summary}</Section>}

      <Section title={`Resume Rating: ${data.resume_rating ?? "-"}`}>
        {data.improvement_areas && <p>{data.improvement_areas}</p>}
      </Section>

      {data.technical_skills?.length > 0 && (
        <Section title="Technical Skills">{data.technical_skills.join(", ")}</Section>
      )}

      {data.soft_skills?.length > 0 && (
        <Section title="Soft Skills">{data.soft_skills.join(", ")}</Section>
      )}

      {data.work_experience?.length > 0 && (
        <Section title="Work Experience">
          {data.work_experience.map((w, i) => (
            <div key={i} style={{ marginBottom: 6 }}>
              <strong>{w.role}</strong> @ {w.company} — {w.duration}
              {w.description?.length > 0 && (
                <ul>
                  {w.description.map((d, idx) => (
                    <li key={idx}>{d}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </Section>
      )}

      {data.education?.length > 0 && (
        <Section title="Education">
          {data.education.map((e, i) => (
            <div key={i}>
              {e.degree} — {e.institution} ({e.graduation_year})
            </div>
          ))}
        </Section>
      )}

      {data.projects?.length > 0 && (
        <Section title="Projects">
          {data.projects.map((p, i) => (
            <div key={i}>
              <strong>{p.name}</strong>: {p.description}
            </div>
          ))}
        </Section>
      )}

      {data.certifications?.length > 0 && (
        <Section title="Certifications">
          <ul>
            {data.certifications.map((c, i) => (
              <li key={i}>{c}</li>
            ))}
          </ul>
        </Section>
      )}

      {data.upskill_suggestions?.length > 0 && (
        <Section title="Upskill Suggestions">
          <ul>
            {data.upskill_suggestions.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </Section>
      )}
    </div>
  );
}
