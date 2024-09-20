import { Fragment } from "react";
import { Layout } from 'antd';

const { Footer } = Layout;

export default function FooterAdmin() {
    return (
        <Fragment>
            <Footer className="d-flex align-items-center justify-content-between"
                style={{
                    textAlign: 'center',
                }}
            >
                <div>Term &amp; Conditions</div>
                <div>Privacy &amp; Policy</div>
            </Footer>
        </Fragment>
    )
}