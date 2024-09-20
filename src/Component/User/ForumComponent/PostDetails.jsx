const PostDetails = ({ data }) => {
    const { postText, postFile } = data;

    return (
        <div className="form-mid-content">
            <div>
                <p>{postText}</p>
            </div>
            {postFile && <img src={postFile} alt="post"></img>}
        </div>
    );
};

export default PostDetails;
