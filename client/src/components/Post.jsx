import React, { useEffect, useState } from "react";
import { Card, Image } from "antd";
import { GeoPoint } from "firebase/firestore";
import { useParams } from "react-router-dom";
import { PostService } from "../services/postService";
import { ImageService } from "../services/imageService";

const Post = ({ data: initData }) => {
	const [data, setData] = useState(initData);
	const { id } = useParams();

	useEffect(() => {
		async function getPost() {
			const result = await PostService.getPost(id);
			const imageUrl = await ImageService.getImageUrl(result.imagePath);

			setData({ ...result, imageUrl });
		}

		if (id) {
			getPost();
		}
	}, [id]);

	if (!initData && !data) {
		return <div>Loading...</div>;
	}

	return (
		<div className="h-screen snap-start overflow-hidden">
			<Card className="shadow-lg h-3/4">
				<div className="flex justify-between items-center mb-4">
					<div className="text-lg font-semibold">Posted by {data.name}</div>
				</div>
				<div className="mb-4 flex justify-center">
					<Image src={data.imageUrl} alt={data.title} height="192px" width="" />
				</div>
				<div className="flex flex-col items-center">
					<div className="text-2xl font-bold">$$$</div>
					<span className="text-xl font-semibold mr-2">{data.title}</span>
					<span className="text-sm bg-gray-200 py-1 px-2 rounded-full">
						{data.zip ?? "No Zip Code"}
					</span>
				</div>
				<div className="border-t pt-4">
					<p className="mb-4">{data.description}</p>
				</div>
			</Card>
		</div>
	);
};

export default Post;
