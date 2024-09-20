import { Button, Result } from 'antd';
import { useParams } from 'react-router-dom';
import { ConfirmAccountService } from '../../services/userService';

export default function ConfirmEmail() {
    const { email } = useParams();

    if (email !== undefined) {
        const response = async () => {
            const result = await ConfirmAccountService(email);
            return result;
        };
        response();
        return (
            <Result
                status='success'
                title='Xác thực tài khoản thành công.'
                subTitle='Chào mừng bạn đến với trang web của chúng tôi. Hãy trải nghiệm nào!'
                extra={[
                    <Button type='primary'>
                        <a href='/login'>Quay về trang đăng nhập</a>
                    </Button>,
                ]}
            />
        );
    }

    return (
        <Result
            status='success'
            title='Thank you for registering an account at our website.'
            subTitle='Please check your email to verify your account. Wish you have a good day.'
            extra={[
                <Button type='primary'>
                    <a href='https://mail.google.com/'>Go to mailbox</a>
                </Button>,
            ]}
        />
    );
}
