import React from "react";
import "./listing-view.scss";
import AppContent from "../../components/AppContent";
import SystemMessage, {SystemMessageType} from "../../components/SystemMessage";
import Button from "../../components/Button";

export default function ListingView() {
  return (
    <AppContent className="listing-view">
      <SystemMessage type={SystemMessageType.error}>
        <div>ShakeDex API is currently unavailable 😵</div>
        <div>You may still manually upload presigns to view and fulfill auction.</div>
      </SystemMessage>
      <div className="listing-view__content">
        <Button>Upload Presigns</Button>
      </div>
    </AppContent>
  )
}
