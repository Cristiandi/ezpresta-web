import React from "react";
import { useNavigate } from "react-router-dom";
import { Button, IconButton } from "@carbon/react";
import { ChevronLeft } from "@carbon/icons-react";

const BackButton = ({ label }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(-1);
  };

  return (
    <div>
      {label && (
        <Button
          kind="ghost"
          size="sm"
          label="Atras"
          iconDescription="Atras"
          renderIcon={ChevronLeft}
          onClick={handleClick}
        >
          {label}
        </Button>
      )}
      {!label && (
        <IconButton
          kind="ghost"
          size="sm"
          label="Atras"
          iconDescription="Atras"
          renderIcon={ChevronLeft}
          onClick={handleClick}
        ></IconButton>
      )}
    </div>
  );
};

export default BackButton;
