import { GithubOutlined } from '@ant-design/icons';
import { DefaultFooter } from '@ant-design/pro-components';
import { useIntl } from '@umijs/max';

const Footer: React.FC = () => {
  const intl = useIntl();
  const defaultMessage = intl.formatMessage({
    id: 'app.copyright.produced',
    defaultMessage: '涅盘工作室',
  });

  const currentYear = new Date().getFullYear();
  return (
    <DefaultFooter
      style={{
        background: 'none',
      }}
      copyright={`${currentYear}  ADO Logistics | Developed by Nirvan Studio`}
      links={[
        {
          key: 'Nirvan Studio',
          title: 'Nirvan Studio',
          href: 'https://www.google.com/',
          blankTarget: true,
        },
      ]}
    />
  );
};

export default Footer;
