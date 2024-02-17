import React, { useState } from "react";
import { Form, Input, Button, Select, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { ImageService } from "../services/imageService";
import { PostService } from "../services/postService";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";

const CreatePost = () => {
	const [form] = Form.useForm();
	const navigate = useNavigate();
	const { Option } = Select;
	const [isCreating, setIsCreating] = useState(false);

	const onFinish = async (values) => {
		const { title, description, cost, image } = values;

		setIsCreating(true);

		try {
			const uploadedImage = await ImageService.uploadImage(
				image[0].uid,
				image[0].originFileObj
			);

			const post = await PostService.addPost({
				title: title,
				userId: auth.currentUser.uid,
				name: auth.currentUser.displayName,
				description: description,
				cost: cost,
				imagePath: uploadedImage.metadata.fullPath,
			});
			navigate(`/posts/${post.id}`);
		} catch (error) {
			console.error("Error adding document: ", error);
		} finally {
			setIsCreating(false);
		}
	};

	const onImageBeforeUpload = (file) => {
		const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
		if (!isJpgOrPng) {
			alert("You can only upload JPG/PNG file!");
			return Upload.LIST_IGNORE;
		}

		return false;
	};

	return (
		<>
			<h1 className="text-center">Create New Post</h1>
			<div className="max-w-md mx-auto p-4">
				<Form
					form={form}
					name="createPost"
					onFinish={onFinish}
					layout="vertical"
					autoComplete="off"
				>
					<Form.Item
						label="Post Title"
						name="title"
						rules={[{ required: true, message: "Please input your post title!" }]}
					>
						<Input />
					</Form.Item>

					<Form.Item
						label="Post Description"
						name="description"
						rules={[{ required: true, message: "Please input your post description!" }]}
					>
						<Input.TextArea rows={4} />
					</Form.Item>

					<Form.Item
						label="Post Cost"
						name="cost"
						rules={[{ required: true, message: "Please select your post cost!" }]}
					>
						<Select placeholder="Select a cost">
							<Option value="free">Free</Option>
							<Option value="$">$</Option>
							<Option value="$$">$$</Option>
							<Option value="$$$">$$$</Option>
						</Select>
					</Form.Item>

					<Form.Item
						label="Post Image"
						name="image"
						valuePropName="fileList"
						rules={[{ required: true, message: "Please upload your post image!" }]}
						getValueFromEvent={(e) => {
							if (Array.isArray(e)) {
								return e;
							}
							return e && e.fileList;
						}}
					>
						<Upload
							name="logo"
							listType="picture"
							beforeUpload={onImageBeforeUpload}
							maxCount={1}
						>
							<Button icon={<UploadOutlined />}>
								Click to upload (JPG/PNG only)
							</Button>
						</Upload>
					</Form.Item>

					<Form.Item>
						<Button type="primary" htmlType="submit" loading={isCreating}>
							Submit Post
						</Button>
					</Form.Item>
				</Form>
			</div>
		</>
	);
};

export default CreatePost;
