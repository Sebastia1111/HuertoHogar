// src/pages/BlogDetailPage.jsx
import { BLOGS } from '../data/blogs';
import { Heading, Text } from '../components/atoms/Typography';

export const BlogDetailPage = ({ id }) => {
  const blog = BLOGS.find((b) => b.id === id) || BLOGS[0];

  return (
    <div className="container my-5" style={{ maxWidth: '800px' }}>
      <a href="#/blogs" className="text-success text-decoration-none fw-bold mb-4 d-inline-block">
        ‹ Volver a blogs
      </a>

      <article className="bg-white border rounded-4 p-4 p-md-5 shadow-sm">
        <div className="display-1 text-center p-4 rounded-4 cat-organicos mb-4">{blog.emoji}</div>
        <span className="badge bg-success-subtle text-success mb-2">{blog.categoria}</span>
        <Heading level={1} className="fw-bold text-dark mb-2">{blog.titulo}</Heading>
        <Text className="text-muted small mb-4">
          {blog.fecha} · por {blog.autor} · {blog.minLectura} min de lectura
        </Text>

        {blog.cuerpo.map((par, idx) => (
          <p key={idx} className="text-secondary lh-lg mb-3">
            {par}
          </p>
        ))}
      </article>
    </div>
  );
};