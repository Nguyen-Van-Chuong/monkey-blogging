import styled from "styled-components";
import PropTypes from "prop-types";
const FieldStyles = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 40px;
  row-gap: 20px;
  &:last-child {
    margin-bottom: 0;
  }
`;
const Field = ({ children }) => {
  return <FieldStyles>{children}</FieldStyles>;
};
Field.prototypes = {
  children: PropTypes.node,
};

export default Field;
