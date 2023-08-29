import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

interface ConfirmationModelProps {
    message: string;
    confirmMessage: string;
    closeMessage: string;
    onConfirm: () => void;
    onCancel: () => void;
}

const ConfirmationModel = ({ message, confirmMessage, closeMessage, onConfirm, onCancel }: ConfirmationModelProps) => {

    const handleConfirm = () => {
        onConfirm();
        toast.dismiss();
        toast.success(confirmMessage, {
            duration: 300,
        })
    };

    const handleCancel = () => {
        onCancel();
        toast.dismiss();
        toast.error(closeMessage, {
            duration: 300,
        });
    }

    return (
        <div className="confirmation-model p-4 rounded-lg shadow-md">
            <p className="mb-4">{message}</p>
            <div className="flex gap-2">
                <button className="px-4 py-2 border border-myyellow rounded-md" onClick={handleConfirm}>Confirm</button>
                <button className="px-4 py-2 border border-tomato rounded-md" onClick={handleCancel}>Cancel</button>
            </div>
        </div>
    );
};

export default ConfirmationModel;
