import React from 'react';
import './ChatAttachmentPreview.css';
import { DownloadIcon } from 'lucide-react';

interface Attachment {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
}

interface Props {
  attachment: Attachment;
}

const ChatAttachmentPreview: React.FC<Props> = ({ attachment }) => {
  const fileType = attachment.type;

  const handleDownload = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/attachments/attachment/${attachment.id}/download?t=${new Date().getTime()}`, {
        method: 'GET',
      });

      const blob = await response.blob();
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = attachment.name;
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error('Download failed', err);
    }
  };

  const formatFileSize = (bytes: number) => {
    return (bytes / 1024).toFixed(1) + ' KB';
  };

  if (fileType.startsWith('image/')) {
    return (
      <div className="attachment-box">
        <img src={`http://localhost:5000/api/attachments/attachment/${attachment.id}/download`} alt={attachment.name} className="preview-image" />
        <DownloadIcon className="download-icon" onClick={handleDownload} />
      </div>
    );
  }

  if (fileType === 'application/pdf') {
    return (
      <div className="attachment-box">
        <embed src={`http://localhost:5000/api/attachments/attachment/${attachment.id}/download#page=1&toolbar=0`} type="application/pdf" className="preview-pdf" />
        <div className="attachment-info">
          <div className="filename">{attachment.name}</div>
          <div className="filesize">{formatFileSize(attachment.size)}</div>
        </div>
        <DownloadIcon className="download-icon" onClick={handleDownload} />
      </div>
    );
  }

  return (
    <div className="attachment-box">
      <div className="attachment-info">
        <div className="filename">{attachment.name}</div>
        <div className="filesize">{formatFileSize(attachment.size)}</div>
      </div>
      <DownloadIcon className="download-icon" onClick={handleDownload} />
    </div>
  );
};

export default ChatAttachmentPreview;
