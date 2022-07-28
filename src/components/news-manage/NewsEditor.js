import React, { useEffect, useState } from "react";
import { Editor } from "react-draft-wysiwyg";
import { convertToRaw, ContentState, EditorState } from "draft-js";
import draftToHtml from "draftjs-to-html";
import htmlToDraftjs from "html-to-draftjs";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

export default function NewsEditor(props) {
	const [editState, seteditState] = useState();

	useEffect(() => {
		const html = props.content;
		if (html === undefined) {
			return;
		}
		const contentBlock = htmlToDraftjs(html);
		if (contentBlock) {
			const contentState = ContentState.createFromBlockArray(
				contentBlock.contentBlocks
			);
			const editorState = EditorState.createWithContent(contentState);
			// @ts-ignore
			seteditState(editorState);
		}
	}, [props.content]);
	return (
		<div>
			<Editor
				editorState={editState}
				onEditorStateChange={(editState) =>
					seteditState(
						// @ts-ignore
						editState
					)
				}
				onBlur={() =>
					props.getTextInfo(
						// @ts-ignore
						draftToHtml(convertToRaw(editState.getCurrentContent()))
					)
				}
			></Editor>
		</div>
	);
}
