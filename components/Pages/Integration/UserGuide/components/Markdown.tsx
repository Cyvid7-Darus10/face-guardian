import React from "react";
import ReactMarkdown from "react-markdown";
import rehypeSlug from "rehype-slug";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";
import styles from "@/styles/markdown.module.css";

const Markdown = ({ content }: { content: any }) => {
	return (
		<div>
			<ReactMarkdown
				className={styles.markdown}
				remarkPlugins={[remarkGfm]}
				rehypePlugins={[rehypeSlug, rehypeHighlight]}>
				{content}
			</ReactMarkdown>
		</div>
	);
};

export default Markdown;
