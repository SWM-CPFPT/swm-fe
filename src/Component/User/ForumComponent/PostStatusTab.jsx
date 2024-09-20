import { useSearchParams } from 'react-router-dom';
const PostStatusTab = ({ statusList }) => {
    const [searchParams, setSearchParams] = useSearchParams();

    const handleRenderClassnamesByStatus = (statusName) => {
        if (!searchParams.get('status') && !statusName) return 'post-tab-item active';
        return searchParams.get('status') === statusName ? 'post-tab-item active' : 'post-tab-item';
    };

    return (
        <div className='post-tab-container'>
            {statusList.map((status) => {
                const { id, name, title } = status;
                return (
                    <button
                        className={handleRenderClassnamesByStatus(name)}
                        key={id}
                        onClick={() => (name ? setSearchParams({ status: name }) : setSearchParams({}))}
                    >
                        {title}
                    </button>
                );
            })}
        </div>
    );
};

export default PostStatusTab;
