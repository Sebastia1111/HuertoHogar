// src/pages/BlogsPage.jsx
import { BLOGS } from '../data/blogs';
import { Heading, Text } from '../components/atoms/Typography';

export const BlogsPage = () => {
  return (
    <div className="container my-5">
      <div className="text-center mb-5">
        <Heading level={1} className="fw-bold text-success">Blogs</Heading>
        <Text className="text-muted fs-5">Noticias y datos curiosos del mundo del campo.</Text>
      </div>

      <div className="row row-cols-1 row-cols-md-2 g-4">
        {BLOGS.map((b) => (
          <div key={b.id} className="col">
            <div className="card h-100 border rounded-4 shadow-sm p-3 d-flex flex-row align-items-center gap-3">
              <div className={`display-3 p-3 rounded-4 cat-organicos text-center flex-shrink-0`}>
                {b.emoji}
              </div>
              <div className="card-body p-0">
                <span className="badge bg-success-subtle text-success mb-1">{b.categoria}</span>
                <Heading level={4} className="fs-5 fw-bold mb-2">
                  <a href={`#/blog/${b.id}`} className="text-dark text-decoration-none">
                    {b.titulo}
                  </a>
                </Heading>
                <Text className="text-muted small mb-2">{b.resumen}</Text>
                <a href={`#/blog/${b.id}`} className="text-success fw-bold small text-decoration-none">
                  Leer más ›
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};