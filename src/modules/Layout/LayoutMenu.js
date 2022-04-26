import React, {useContext, useState} from "react";
import "./LayoutMenu.css";
import { Layout, Menu, Breadcrumb, Avatar, Dropdown, Button } from "antd";
import {
  HomeOutlined,
  TeamOutlined,
  UserOutlined,
  UnorderedListOutlined,
  PlusCircleOutlined,
  ProjectOutlined,
  ToolOutlined,
  SolutionOutlined,
  ShopOutlined
} from "@ant-design/icons";
import {Link, withRouter} from "react-router-dom";
import logo from "../../assets/images/logo.png";
import logoFull from "../../assets/images/logoFull.png";
import {compose} from "redux";
import {connect, useDispatch, useSelector} from "react-redux";
import * as links from "../../constants/links";
import {setDataUser} from "../../redux/actions/auth";

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
          <Menu.Item key="home" icon={<HomeOutlined />}>
            <Link to={links.HOME}>Trang chủ</Link>
          </Menu.Item>
          <SubMenu
            key="employee"
            icon={<TeamOutlined />}
            title="Quản lý nhân viên"
            // disabled={![ROLE_ADMIN, ROLE_INVENTORY_MANAGER].includes(role)}
          >
            <Menu.Item key="employee_1" icon={<UnorderedListOutlined />}>
              <Link to={links.EMPLOYEE_LIST}>Danh sách nhân viên</Link>
            </Menu.Item>
            <Menu.Item key="employee_2" icon={<PlusCircleOutlined />}>
              <Link to={links.EMPLOYEE_NEW}>Thêm nhân viên</Link>
            </Menu.Item>
          </SubMenu>
          <SubMenu
            key="product"
            icon={<ShopOutlined />}
            title="Quản lý sản phẩm"
            // disabled={![ROLE_ADMIN, ROLE_INVENTORY_MANAGER].includes(role)}
          >
            <Menu.Item key="product_1" icon={<UnorderedListOutlined />}>
              <Link to={links.PRODUCT_LIST}>Danh sách sản phẩm</Link>
            </Menu.Item>
            <Menu.Item key="product_2" icon={<PlusCircleOutlined />}>
              <Link to={links.PRODUCT_NEW}>Thêm sản phẩm</Link>
            </Menu.Item>
            <Menu.Item key="product_3" icon={<UnorderedListOutlined />}>
              <Link to={links.PRODUCT_TYPE_LIST}>Danh sách loại sản phẩm</Link>
            </Menu.Item>
            {/*<Menu.Item key="product_4" icon={<PlusCircleOutlined />}>*/}
            {/*  <Link to={links.PRODUCT_TYPE_NEW}>Thêm loại sản phẩm</Link>*/}
            {/*</Menu.Item>*/}
          </SubMenu>
          <SubMenu
            key="project"
            icon={<ProjectOutlined />}
            title="Quản lý dự án"
            // disabled={![ROLE_ADMIN, ROLE_INVENTORY_MANAGER].includes(role)}
          >
            <Menu.Item key="project_1" icon={<UnorderedListOutlined />}>
              <Link to={links.PROJECT_LIST}>Danh sách dự án</Link>
            </Menu.Item>
            <Menu.Item key="project_2" icon={<PlusCircleOutlined />}>
              <Link to={links.PROJECT_NEW}>Thêm dự án</Link>
            </Menu.Item>
            <Menu.Item key="project_3" icon={<UnorderedListOutlined />}>
              <Link to={links.PROJECT_TYPE_LIST}>Danh sách loại dự án</Link>
            </Menu.Item>
            {/*<Menu.Item key="project_4" icon={<PlusCircleOutlined />}>*/}
            {/*  <Link to={links.PROJECT_TYPE_NEW}>Thêm loại dự án</Link>*/}
            {/*</Menu.Item>*/}
          </SubMenu>
          <SubMenu
            key="equipment"
            icon={<ToolOutlined />}
            title="Quản lý thiết bị"
            // disabled={![ROLE_ADMIN, ROLE_INVENTORY_MANAGER].includes(role)}
          >
            <Menu.Item key="equipment_1" icon={<UnorderedListOutlined />}>
              <Link to={links.EQUIPMENT_LIST}>Danh sách thiết bị</Link>
            </Menu.Item>
            <Menu.Item key="equipment_2" icon={<PlusCircleOutlined />}>
              <Link to={links.EQUIPMENT_NEW}>Thêm thiết bị</Link>
            </Menu.Item>
            <Menu.Item key="equipment_3" icon={<UnorderedListOutlined />}>
              <Link to={links.EQUIPMENT_TYPE_LIST}>Danh sách loại thiết bị</Link>
            </Menu.Item>
            {/*<Menu.Item key="equipment_4" icon={<PlusCircleOutlined />}>*/}
            {/*  <Link to={links.EQUIPMENT_TYPE_NEW}>Thêm loại thiết bị</Link>*/}
            {/*</Menu.Item>*/}
          </SubMenu>
          <SubMenu
            key="client"
            icon={<SolutionOutlined />}
            title="Quản lý khách hàng"
            // disabled={![ROLE_ADMIN, ROLE_INVENTORY_MANAGER].includes(role)}
          >
            <Menu.Item key="client_1" icon={<UnorderedListOutlined />}>
              <Link to={links.CLIENT_LIST}>Danh sách khách hàng</Link>
            </Menu.Item>
            <Menu.Item key="client_2" icon={<PlusCircleOutlined />}>
              <Link to={links.CLIENT_NEW}>Thêm khách hàng</Link>
            </Menu.Item>
          </SubMenu>
          <Menu.Item key="account" icon={<UserOutlined />}>
            <Link to={links.ACCOUNT}>Quản lý tài khoản</Link>
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
        <Footer class="layout-menu-footer">
          {/*Quản lý - Cafe cùng Tony Buổi Sáng*/}
        </Footer>
      </Layout>
    </Layout>
  );
}
export default compose(withRouter,)(LayoutMenu);
