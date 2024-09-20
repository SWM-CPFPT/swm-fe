import { useContext, useRef, useState } from 'react';
import '../../../assets/Forum.css';
import { Button, Form, Select } from 'antd';
import { SubjectContext } from '../../../contexts/SubjectContext';
import { PostContext } from '../../../contexts/PostContext';
import { useSearchParams } from 'react-router-dom';
import { UserContext } from '../../../contexts/UserContext';

const FilterPost = () => {
    const [form] = Form.useForm();
    const [selectionValue, setSelectionValue] = useState(null);

    const { subjects } = useContext(SubjectContext);
    const { user } = useContext(UserContext);
    const { getAllPost, getApprovedPostBySubject, getPostBySubject, getPostByStatus, getPostBySubjectAndStatus } =
        useContext(PostContext);
    const subjectNameRef = useRef(null);

    const [searchParams, setSearchParams] = useSearchParams();
    const statusQueryParams = searchParams.get('status');

    const handleSelectionChange = (subjectValue) => {
        setSelectionValue(subjectValue);
        const subjectFound = subjects.find((subject) => subject.subjectId === subjectValue);
        subjectNameRef.current = subjectFound ? subjectFound.subjectName : null;
    };

    //Handle filter
    const filterConditions = [
        { type: 'both', condition: statusQueryParams && subjectNameRef.current },
        { type: 'subject_guest', condition: !user && !statusQueryParams && subjectNameRef.current },
        { type: 'subject', condition: !statusQueryParams && subjectNameRef.current },
        { type: 'status', condition: statusQueryParams && !subjectNameRef.current },
    ];

    const filterType = filterConditions.find((c) => c.condition)?.type;

    const handleSubmitFilterForm = () => {
        switch (filterType) {
            case 'both':
                console.log(filterType)
                getPostBySubjectAndStatus(selectionValue, statusQueryParams, user.accountId);
                setSearchParams({
                    status: statusQueryParams,
                    subject: `${subjectNameRef.current}`,
                });
                break;
            case 'subject_guest':
                console.log(filterType)
                getApprovedPostBySubject(selectionValue);
                setSearchParams({ subject: `${subjectNameRef.current}` });
                break;
            case 'subject':
                console.log(filterType)
                getPostBySubject(selectionValue, user.accountId);
                setSearchParams({ subject: `${subjectNameRef.current}` });
                break;
            case 'status':
                console.log(filterType)
                getPostByStatus(statusQueryParams);
                setSearchParams({ status: statusQueryParams });
                break;
            default:
                console.log(filterType)
                getAllPost();
                setSearchParams({});
        }
    };

    return (
        <Form
            layout='horizontal'
            form={form}
            onFinish={handleSubmitFilterForm}
            id='filter-post-form'
        >
            <Form.Item className='select-box form-item'>
                <Select
                    label='Môn học'
                    defaultValue={0}
                    onChange={(subjectValue) => handleSelectionChange(subjectValue)}
                >
                    <Select.Option value={0}>-- Tất cả môn học --</Select.Option>
                    {subjects?.map((subject) => (
                        <Select.Option
                            key={subject.subjectId}
                            value={subject.subjectId}
                            ref={subjectNameRef}
                        >
                            {subject.subjectName}
                        </Select.Option>
                    ))}
                </Select>
            </Form.Item>
            <Form.Item className='form-item'>
                <Button
                    type='primary'
                    htmlType='submit'
                >
                    Lọc
                </Button>
            </Form.Item>
        </Form>
    );
};

export default FilterPost;
