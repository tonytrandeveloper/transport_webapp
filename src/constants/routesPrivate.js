import React, {lazy} from 'react';
import * as links from "../constants/links";
import Home from "../restore/components/Home/Home";
import {FORM_TYPE_EDIT, FORM_TYPE_NEW, ROLE_ADMIN, ROLE_EMPLOYEE, ROLE_SUPERADMIN} from "./constants";
import EmployeeList from "../modules/Employee/EmployeeList";
import EmployeeForm from "../modules/Employee/EmployeeForm";
import ProjectList from "../modules/Project/ProjectList";
import ProjectTypeList from "../modules/ProjectType/ProjectTypeList";
import ProductList from "../modules/Product/ProductList";
import ProductForm from "../modules/Product/ProductForm";
import ProductTypeList from "../modules/ProductType/ProductTypeList";
import EquipmentList from "../modules/Equipment/EquipmentList";
import EquipmentTypeList from "../modules/EquipmentType/EquipmentTypeList";
import AccountManager from "../modules/Account/AccountManager";
import ClientList from "../modules/Client/ClientList";
import ClientNew from "../modules/Client/ClientNew";
import ClientEdit from "../modules/Client/ClientEdit";
import EquipmentForm from "../modules/Equipment/EquipmentForm";
import ProjectForm from "../modules/Project/ProjectForm";

const arrayRoutesPrivate = [
  {
    path: links.HOME,
    component: () => <Home/>,
    exact: true,
    permission: [
      ROLE_SUPERADMIN,
      ROLE_ADMIN,
      ROLE_EMPLOYEE
    ]
  },
  {
    path: links.ACCOUNT,
    component: (match) => <EmployeeForm match={match} formType="account"/>,
    exact: true,
    permission: [
      ROLE_SUPERADMIN,
      ROLE_ADMIN,
      ROLE_EMPLOYEE
    ]
  },
  {
    path: links.EMPLOYEE_LIST,
    component: () => <EmployeeList/>,
    exact: true,
    permission: [
      ROLE_SUPERADMIN,
      ROLE_ADMIN,
    ]
  },
  {
    path: links.EMPLOYEE_NEW,
    component: (match) => <EmployeeForm match={match} formType={FORM_TYPE_NEW}/>,
    exact: true,
    permission: [
      ROLE_SUPERADMIN,
      ROLE_ADMIN,
    ]
  },
  {
    path: links.EMPLOYEE_EDIT,
    component: (match) => <EmployeeForm match={match}  formType={FORM_TYPE_EDIT}/>,
    exact: true,
    permission: [
      ROLE_SUPERADMIN,
      ROLE_ADMIN,
    ]
  },
  {
    path: links.PROJECT_LIST,
    component: () => <ProjectList/>,
    exact: true,
    permission: [
      ROLE_SUPERADMIN,
      ROLE_ADMIN,
    ]
  },
  {
    path: links.PROJECT_NEW,
    component: (match) => <ProjectForm match={match} formType={FORM_TYPE_NEW}/>,
    exact: true,
    permission: [
      ROLE_SUPERADMIN,
      ROLE_ADMIN,
    ]
  },
  {
    path: links.PROJECT_EDIT,
    component: (match) => <ProjectForm match={match}  formType={FORM_TYPE_EDIT}/>,
    exact: true,
    permission: [
      ROLE_SUPERADMIN,
      ROLE_ADMIN,
    ]
  },
  {
    path: links.PROJECT_TYPE_LIST,
    component: () => <ProjectTypeList/>,
    exact: true,
    permission: [
      ROLE_SUPERADMIN,
      ROLE_ADMIN,
    ]
  },
  {
    path: links.PRODUCT_LIST,
    component: () => <ProductList/>,
    exact: true,
    permission: [
      ROLE_SUPERADMIN,
      ROLE_ADMIN,
    ]
  },
  {
    path: links.PRODUCT_NEW,
    component: (match) => <ProductForm match={match} formType={FORM_TYPE_NEW}/>,
    exact: true,
    permission: [
      ROLE_SUPERADMIN,
      ROLE_ADMIN,
    ]
  },
  {
    path: links.PRODUCT_EDIT,
    component: (match) => <ProductForm match={match}  formType={FORM_TYPE_EDIT}/>,
    exact: true,
    permission: [
      ROLE_SUPERADMIN,
      ROLE_ADMIN,
    ]
  },
  {
    path: links.PRODUCT_TYPE_LIST,
    component: (match) => <ProductTypeList match={match}/>,
    exact: true,
    permission: [
      ROLE_SUPERADMIN,
      ROLE_ADMIN,
    ]
  },
  {
    path: links.EQUIPMENT_LIST,
    component: () => <EquipmentList/>,
    exact: true,
    permission: [
      ROLE_SUPERADMIN,
      ROLE_ADMIN,
    ]
  },
  {
    path: links.EQUIPMENT_NEW,
    component: (match) => <EquipmentForm match={match} formType={FORM_TYPE_NEW}/>,
    exact: true,
    permission: [
      ROLE_SUPERADMIN,
      ROLE_ADMIN,
    ]
  },
  {
    path: links.EQUIPMENT_EDIT,
    component: (match) => <EquipmentForm match={match}  formType={FORM_TYPE_EDIT}/>,
    exact: true,
    permission: [
      ROLE_SUPERADMIN,
      ROLE_ADMIN,
    ]
  },
  {
    path: links.EQUIPMENT_TYPE_LIST,
    component: () => <EquipmentTypeList/>,
    exact: true,
    permission: [
      ROLE_SUPERADMIN,
      ROLE_ADMIN,
    ]
  },
  {
    path: links.CLIENT_LIST,
    component: () => <ClientList/>,
    exact: true,
    permission: [
      ROLE_SUPERADMIN,
      ROLE_ADMIN,
    ]
  },
  {
    path: links.CLIENT_NEW,
    component: () => <ClientNew/>,
    exact: true,
    permission: [
      ROLE_SUPERADMIN,
      ROLE_ADMIN,
    ]
  },
  {
    path: links.CLIENT_EDIT,
    component: () => <ClientEdit/>,
    exact: true,
    permission: [
      ROLE_SUPERADMIN,
      ROLE_ADMIN,
    ]
  },
];


export default arrayRoutesPrivate;
