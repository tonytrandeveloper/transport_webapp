import React, {useContext, useState} from "react";
import { Layout, Menu, Breadcrumb, Avatar, Dropdown, Button } from "antd";
import {
  ScheduleOutlined,
  HomeOutlined,
  BarsOutlined,
  TeamOutlined,
  UserOutlined,
  TableOutlined,
  ImportOutlined,
  ExportOutlined,
  ExperimentOutlined,
  BankOutlined,
  TagsOutlined,
  ShopOutlined,
  MenuOutlined,
  DatabaseOutlined,
  ProfileOutlined,
} from "@ant-design/icons";
import {Link, withRouter} from "react-router-dom";
import logo from "../../../assets/images/logo.png";
import logoFull from "../../../assets/images/logoFull.png";
import {compose} from "redux";
import {connect, useDispatch, useSelector} from "react-redux";
import * as authActions from "../../../redux/actions/auth";
import {LINK_DIRECTORY_FILES, ROLE_ADMIN, ROLE_CASHIER, ROLE_INVENTORY_MANAGER} from "../../../constants/constants";
import {AppContext} from "../../../contexts/AppContext";
import auth from "../../../redux/reducers/auth";
import {setDataUser} from "../../../redux/actions/auth";
import {EMPLOYEE_LIST, EMPLOYEE_NEW} from "../../../constants/links";

const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;
const LayoutMenu = (props) => {
  const {
    children
  } = props;
  // const {
  //   user,
  //   setUser
  // } = useContext(AppContext);
  const {
      dataUser
  } = useSelector(state => state.authReducer);
  const dispatch = useDispatch();
  console.log(dataUser)
  const [collapsed, setCollapsed] = useState(false);
  const email = dataUser?.data?.person?.email ?? "";
  const username = dataUser?.data?.username ?? "";
  const role = dataUser?.data?.role ?? "";
  const photo = dataUser?.data?.person?.avatar.fileId ? `https://drive.google.com/uc?export=view&id=${dataUser?.data?.person?.avatar.fileId}` : null;
  console.log(role)
  const menu = (
    <Menu>
      <Menu.Item>{email}</Menu.Item>
      <Menu.Item>{role}</Menu.Item>
      <Menu.Item onClick={() => {
        dispatch(setDataUser(null))
      }}>Đăng xuất</Menu.Item>
    </Menu>
  );

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider collapsible collapsed={collapsed} onCollapse={() => {
        setCollapsed(prev => !prev)
      }}>
        <div
          className="logo"
          style={collapsed ? { padding: "4px" } : { padding: "4px" }}
        >
          <img src={collapsed ? logo : logoFull} height={"60px"} />
        </div>
        <Menu theme="dark"  defaultSelectedKeys={["1"]}>
          <Menu.Item key="1" icon={<HomeOutlined />}>
            <Link to="/">Trang chủ</Link>
          </Menu.Item>
          {/*<Menu.Item*/}
          {/*  key="2"*/}
          {/*  icon={<ScheduleOutlined />}*/}
          {/*  disabled={![ROLE_ADMIN, ROLE_CASHIER].includes(role)}*/}
          {/*>*/}
          {/*  <Link to="/order">Quản lý đơn hàng</Link>*/}
          {/*</Menu.Item>*/}
          {/*<SubMenu*/}
          {/*  key="sub3"*/}
          {/*  icon={<MenuOutlined />}*/}
          {/*  title="Quản lý sản phẩm"*/}
          {/*  disabled={![ROLE_ADMIN].includes(role)}*/}
          {/*>*/}
          {/*  <Menu.Item key="3" icon={<ProfileOutlined />}>*/}
          {/*    <Link to="/product">Danh mục sản phẩm</Link>*/}
          {/*  </Menu.Item>*/}
          {/*  <Menu.Item key="10" icon={<TagsOutlined />}>*/}
          {/*    <Link to="/typeProduct">Quản lý loại sản phẩm</Link>*/}
          {/*  </Menu.Item>*/}
          {/*</SubMenu>*/}
          {/*<SubMenu*/}
          {/*  key="sub1"*/}
          {/*  icon={<DatabaseOutlined />}*/}
          {/*  title="Quản lý kho"*/}
          {/*  disabled={![ROLE_ADMIN, ROLE_INVENTORY_MANAGER].includes(role)}*/}
          {/*>*/}
          {/*  <Menu.Item key="4" icon={<BarsOutlined />}>*/}
          {/*    <Link to="/material">Quản lý nguyên liệu</Link>*/}
          {/*  </Menu.Item>*/}
          {/*  <Menu.Item key="5" icon={<ImportOutlined />}>*/}
          {/*    <Link to="/material/import">Nhập nguyên liệu</Link>*/}
          {/*  </Menu.Item>*/}
          {/*  <Menu.Item key="6" icon={<ExportOutlined />}>*/}
          {/*    <Link to="/material/export">Xuất nguyên liệu</Link>*/}
          {/*  </Menu.Item>*/}
          {/*</SubMenu>*/}
          {/*<SubMenu*/}
          {/*  key="sub2"*/}
          {/*  icon={<ShopOutlined />}*/}
          {/*  title="Quản lý cửa hàng"*/}
          {/*  disabled={![ROLE_ADMIN].includes(role)}*/}
          {/*>*/}
          {/*  <Menu.Item*/}
          {/*    key="7"*/}
          {/*    icon={<TableOutlined />}*/}
          {/*    disabled={![ROLE_ADMIN].includes(role)}*/}
          {/*  >*/}
          {/*    <Link to="/store/table">Quản lý bàn</Link>*/}
          {/*  </Menu.Item>*/}
          {/*</SubMenu>*/}
          {/*<Menu.Item*/}
          {/*  key="8"*/}
          {/*  icon={<TeamOutlined />}*/}
          {/*  // disabled={![ROLE_ADMIN].includes(role)}*/}
          {/*>*/}
          {/*  <Link to="/member">Quản lý thành viên</Link>*/}
          {/*</Menu.Item>*/}
          <SubMenu
            key="employee"
            icon={<TeamOutlined />}
            title="Quản lý nhân viên"
            // disabled={![ROLE_ADMIN, ROLE_INVENTORY_MANAGER].includes(role)}
          >
            <Menu.Item key="employee_1" icon={<BarsOutlined />}>
              <Link to={EMPLOYEE_LIST}>Danh sách nhân viên</Link>
            </Menu.Item>
            <Menu.Item key="employee_2" icon={<ImportOutlined />}>
              <Link to={EMPLOYEE_NEW}>Thêm nhân viên</Link>
            </Menu.Item>
          </SubMenu>
          <SubMenu
            key="product"
            icon={<TeamOutlined />}
            title="Quản lý sản phẩm"
            // disabled={![ROLE_ADMIN, ROLE_INVENTORY_MANAGER].includes(role)}
          >
            <Menu.Item key="product_1" icon={<BarsOutlined />}>
              <Link to={EMPLOYEE_LIST}>Danh sách nhân viên</Link>
            </Menu.Item>
            <Menu.Item key="product_2" icon={<ImportOutlined />}>
              <Link to={EMPLOYEE_NEW}>Thêm nhân viên</Link>
            </Menu.Item>
          </SubMenu>
          <SubMenu
            key="employee"
            icon={<TeamOutlined />}
            title="Quản lý nhân viên"
            // disabled={![ROLE_ADMIN, ROLE_INVENTORY_MANAGER].includes(role)}
          >
            <Menu.Item key="employee_1" icon={<BarsOutlined />}>
              <Link to={EMPLOYEE_LIST}>Danh sách nhân viên</Link>
            </Menu.Item>
            <Menu.Item key="employee_2" icon={<ImportOutlined />}>
              <Link to={EMPLOYEE_NEW}>Thêm nhân viên</Link>
            </Menu.Item>
          </SubMenu>
          <Menu.Item key="9" icon={<UserOutlined />}>
            <Link to="/account">Quản lý tài khoản</Link>
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout className="site-layout">
        <Header class="layout-menu-header">
          <div className="header-avatar">
            <Dropdown overlay={menu} placement="bottomRight" arrow>
              <Button
                shape="circle"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                icon={photo ? <div style={{
                  width: 30,
                  height: 30,
                  borderRadius: '50%',
                  overflow: 'hidden'
                }}>
                  <img style={{
                    width: '100%',
                    height: '100%'
                  }} src={photo} alt=""/>
                </div>: <UserOutlined />}
              ></Button>
            </Dropdown>
          </div>
          <div className="header-name">{username}</div>
        </Header>
        <Content style={{ margin: "0 16px" }}>
          <Breadcrumb style={{ margin: "16px 0" }}></Breadcrumb>
          <div
            className="site-layout-background"
            style={{ padding: 24, minHeight: 360, height: "100%" }}
          >
            {children}
          </div>
        </Content>
        <Footer class="layout-menu-footer">Quản lý - Cafe cùng Tony Buổi Sáng</Footer>
      </Layout>
    </Layout>
  );
}
export default compose(withRouter,)(LayoutMenu);
