<?php
header('Content-Type: application/json');

class UploadHandler {
    private $uploadDir = 'uploads/posters/';
    private $maxFileSize = 5242880; // 5MB
    private $allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
    private $allowedExtensions = ['jpg', 'jpeg', 'png', 'webp'];
    
    public function __construct() {
        // Create upload directory if it doesn't exist
        if (!file_exists($this->uploadDir)) {
            mkdir($this->uploadDir, 0777, true);
        }
    }
    
    public function uploadFile($file) {
        // Check if file was uploaded without errors
        if (!isset($file) || $file['error'] !== UPLOAD_ERR_OK) {
            $errorMessage = 'File upload failed. ';
            switch ($file['error'] ?? UPLOAD_ERR_NO_FILE) {
                case UPLOAD_ERR_INI_SIZE:
                case UPLOAD_ERR_FORM_SIZE:
                    $errorMessage .= 'File too large.';
                    break;
                case UPLOAD_ERR_PARTIAL:
                    $errorMessage .= 'File was only partially uploaded.';
                    break;
                case UPLOAD_ERR_NO_FILE:
                    $errorMessage .= 'No file was selected.';
                    break;
                case UPLOAD_ERR_NO_TMP_DIR:
                    $errorMessage .= 'Missing temporary folder.';
                    break;
                case UPLOAD_ERR_CANT_WRITE:
                    $errorMessage .= 'Failed to write file to disk.';
                    break;
                default:
                    $errorMessage .= 'Error code: ' . ($file['error'] ?? 'No file');
            }
            return [
                'success' => false,
                'error' => $errorMessage
            ];
        }
        
        // Validate file size
        if ($file['size'] > $this->maxFileSize) {
            return [
                'success' => false,
                'error' => 'File too large. Maximum size is 5MB. Your file: ' . round($file['size'] / 1024 / 1024, 2) . 'MB'
            ];
        }
        
        // Validate file type using finfo (more secure)
        $finfo = finfo_open(FILEINFO_MIME_TYPE);
        $mimeType = finfo_file($finfo, $file['tmp_name']);
        finfo_close($finfo);
        
        if (!in_array($mimeType, $this->allowedTypes)) {
            return [
                'success' => false,
                'error' => 'Invalid file type: ' . $mimeType . '. Only JPG, PNG, and WEBP images are allowed.'
            ];
        }
        
        // Validate file extension
        $extension = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
        if (!in_array($extension, $this->allowedExtensions)) {
            return [
                'success' => false,
                'error' => 'Invalid file extension: .' . $extension . '. Only .jpg, .jpeg, .png, and .webp are allowed.'
            ];
        }
        
        // Additional security: Check if it's actually an image
        if (!getimagesize($file['tmp_name'])) {
            return [
                'success' => false,
                'error' => 'Uploaded file is not a valid image.'
            ];
        }
        
        // Generate unique filename
        $filename = uniqid() . '_' . time() . '.' . $extension;
        $filepath = $this->uploadDir . $filename;
        
        // Move uploaded file
        if (move_uploaded_file($file['tmp_name'], $filepath)) {
            // Set proper permissions
            chmod($filepath, 0644);
            
            // Return web-accessible path
            $webPath = 'uploads/posters/' . $filename;
            
            return [
                'success' => true,
                'filepath' => $webPath,
                'filename' => $filename,
                'fullpath' => $filepath
            ];
        } else {
            return [
                'success' => false,
                'error' => 'Failed to save uploaded file. Please check directory permissions.'
            ];
        }
    }
}

// Handle the upload request
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Check if this is a file upload
    if (isset($_FILES['poster_file']) && $_FILES['poster_file']['error'] !== UPLOAD_ERR_NO_FILE) {
        $uploader = new UploadHandler();
        $result = $uploader->uploadFile($_FILES['poster_file']);
        echo json_encode($result);
        exit();
    }
    
    // Handle URL validation
    $input = json_decode(file_get_contents('php://input'), true);
    if (isset($input['validate_url']) && isset($input['url'])) {
        $url = filter_var($input['url'], FILTER_VALIDATE_URL);
        if ($url && preg_match('/\.(jpg|jpeg|png|webp)$/i', $url)) {
            echo json_encode(['success' => true, 'message' => 'Valid URL']);
        } else {
            echo json_encode(['success' => false, 'error' => 'Invalid image URL']);
        }
        exit();
    }
}

// Invalid request
echo json_encode(['success' => false, 'error' => 'Invalid request. Please select a file to upload.']);
exit();
?>