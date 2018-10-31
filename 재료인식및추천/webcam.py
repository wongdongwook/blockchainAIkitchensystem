# -*- coding: utf-8 -*-
"""
Created on Fri Sep 14 21:44:50 2018

@author: kwctl
"""
import sys
import cv2
from PyQt5.QtWidgets import QApplication, QDialog
from PyQt5.uic import loadUi
from PyQt5.QtCore import QTimer
from PyQt5 import QtCore
from PyQt5.QtGui import QImage, QPixmap
import math
import numpy as np
import pyautogui

check1=0
check2=0
check1_1=0


f=0
class wook(QDialog):
    def __init__(self):
        super(wook,self).__init__()
        loadUi('C:\\Users\\kwctl\\Desktop\\wook1.ui',self)
        self.image=None
        self.processedImage=None
        self.startButton.clicked.connect(self.start_webcam)
        self.stopButton.clicked.connect(self.stop_webcam)
        self.cannyButton.toggled.connect(self.canny_webcam)
        self.cannyButton.setCheckable(True)
        self.canny_Enabled=False
    
    def canny_webcam(self,status):
        if status:
            self.canny_Enabled=True
            self.cannyButton.setText('Canny stop')
        else:
            self.canny_Enabled=True
            self.cannyButton.setText('Canny')
    
    def start_webcam(self):
        self.capture=cv2.VideoCapture(0)
        self.capture.set(cv2.CAP_PROP_FRAME_HEIGHT,480)
        self.capture.set(cv2.CAP_PROP_FRAME_WIDTH,640)
        
        self.timer=QTimer(self)
        self.timer.timeout.connect(self.update_frame)
        self.timer.start(30)
        
    def update_frame(self):
        ret,self.image=self.capture.read()
        frame=self.image
        cv2.rectangle(frame,(0,200),(300,480),(0,255,0),0)
        crop_image = frame[200:480, 0:300]
        blur = cv2.GaussianBlur(crop_image, (3,3), 0)
        hsv = cv2.cvtColor(blur, cv2.COLOR_BGR2HSV)
        mask2 = cv2.inRange(hsv, np.array([0,20,50]), np.array([20,255,180]))
        kernel = np.ones((5,5))
        dilation = cv2.dilate(mask2, kernel, iterations = 2)
        erosion = cv2.erode(dilation, kernel, iterations = 3)

        filtered = cv2.GaussianBlur(erosion, (3,3), 0)
        ret,thresh = cv2.threshold(filtered, 127, 255, 0)

      
    # Find contours
        image, contours, hierarchy = cv2.findContours(thresh, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE )
        
        try:
            # Find contour with maximum area
            contour = max(contours, key = lambda x: cv2.contourArea(x))
            M=cv2.moments(contour)
            cx=int(M['m10']/M['m00'])
            cy=int(M['m01']/M['m00'])
            centroid=(cx,cy+200)
            topmost=tuple(contour[contour[:,:,1].argmin()][0])
            px=topmost[0]
            py=topmost[1]+200
            topmost=(px,py)
            cv2.circle(frame,centroid,5,[0,255,255],-1)
            cv2.circle(frame,topmost,5,[0,255,255],-1)
            cv2.line(frame,centroid,topmost,[255,0,0],4)

    
            # Create bounding rectangle around the contour
            x,y,w,h = cv2.boundingRect(contour)
            cv2.rectangle(crop_image,(x,y),(x+w,y+h),(0,0,255),0)
            
            cx=centroid[0]
            cy=centroid[1]+200



            # Find convex hull
            hull = cv2.convexHull(contour)
        
            # Draw contour
            drawing = np.zeros(crop_image.shape,np.uint8)
            cv2.drawContours(drawing,[contour],-1,(0,255,0),0)
            cv2.drawContours(drawing,[hull],-1,(0,0,255),0)

            # Find convexity defects
            hull = cv2.convexHull(contour, returnPoints=False)
            defects = cv2.convexityDefects(contour,hull)

            # Use cosine rule to find angle of the far point from the start and end point i.e. the convex points (the finger
            # tips) for all defects
            count_defects = 0

            for i in range(defects.shape[0]):
                s,e,f,d = defects[i,0]
                start = tuple(contour[s][0])
                end = tuple(contour[e][0])
                far = tuple(contour[f][0])

                a = math.sqrt((end[0] - start[0])**2 + (end[1] - start[1])**2)
                b = math.sqrt((far[0] - start[0])**2 + (far[1] - start[1])**2)
                c = math.sqrt((end[0] - far[0])**2 + (end[1] - far[1])**2)
                angle = (math.acos((b**2 + c**2 - a**2)/(2*b*c))*180)/3.14

                # if angle > 90 draw a circle at the far point
                if angle <= 90:
                    count_defects += 1
                    cv2.circle(crop_image,far,1,[0,0,255],-1)
                    
                    cv2.line(crop_image,start,end,[0,255,0],2)

            # Print number of fingers
            px=int(px*1920/300)
            py=py-200
            py=int(py*1080/280)
            if count_defects == 0 :
                cv2.putText(frame,"ONE", (50,50), cv2.FONT_HERSHEY_SIMPLEX, 2, 2)
                
                
                pyautogui.moveTo(px,py,0.15)
                print((px,py))
            
            
            elif count_defects == 1:
                cv2.putText(frame,"TWO", (50,50), cv2.FONT_HERSHEY_SIMPLEX, 2, 2)

            elif count_defects == 2:
                cv2.putText(frame,"THREE", (50,50), cv2.FONT_HERSHEY_SIMPLEX, 2, 2)

            elif count_defects == 3 :
                cv2.putText(frame,"FOUR", (50,50), cv2.FONT_HERSHEY_SIMPLEX, 2, 2)
                check1=1

            elif count_defects == 4:
                cv2.putText(frame,"FIVE", (50,50), cv2.FONT_HERSHEY_SIMPLEX, 2, 2)
            
            else:
                pass
        except:
            pass
        
        




        self.image=frame
        self.displayImage(self.image,1)
        
        if(self.canny_Enabled):
            gray=cv2.cvtColor(self.image,cv2.COLOR_BGR2GRAY) if len(self.image.shape)>=3 else self.image
            self.processedImage=cv2.Canny(gray,100,200)
            self.displayImage(self.processedImage,2)
        
    def stop_webcam(self):
        self.timer.stop()
        pass
    
    def displayImage(self,img,window=1):
        qformat=QImage.Format_Indexed8
        if len(img.shape)==3: #[0]=rows, [1]=cols [2]=chaneels
            if img.shape[2]==4:
                qformat=QImage.Format_RGBA8888
            else:
                qformat=QImage.Format_RGB888
                
        outImage=QImage(img,img.shape[1],img.shape[0],img.strides[0],qformat)
        #BGR>>RGB
        outImage=outImage.rgbSwapped()
        
        if window ==1: 
            self.imgLabel.setPixmap(QPixmap.fromImage(outImage))
            self.imgLabel.setScaledContents(True)
        if window ==2:
            self.processedLabel.setPixmap(QPixmap.fromImage(outImage))
            self.processedLabel.setScaledContents(True)
            
    
if __name__ =='__main__':
    app=QApplication(sys.argv)
    window=wook()
    window.setWindowTitle('fuck')
    window.show()
    
    sys.exit(app.exec_())
    
        